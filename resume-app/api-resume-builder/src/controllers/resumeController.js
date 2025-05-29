import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import Education from '../models/Education.js';
import { Skill, UserSkill } from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  console.log(req.body,"parag saloni");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let profilePictureData = {};

    if (req.file) {
      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'resume-builder/profile-pictures',
        width: 300,
        crop: 'scale'
      });
      profilePictureData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // 1. Create main resume document
    const resumeData = {
      user: req.user._id,
      title: req.body.title,
      personalDetails: {
        ...req.body.personalDetails,
        profilePicture: profilePictureData
      },
      address: req.body.address,
      professionalSummary: req.body.professionalSummary,
      isTemplate: req.body.isTemplate || false,
      templateName: req.body.templateName,
      visibility: req.body.visibility || 'private'
    };

    const resume = new Resume(resumeData);
    const createdResume = await resume.save({ session });

    // 2. Create education entries
    if (req.body.education?.length) {
      const educationDocs = await Education.insertMany(
        req.body.education.map(edu => ({
          user: req.user._id,
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          description: edu.description,
          visible: edu.visible !== false,
          isPublic: edu.isPublic || false
        })),
        { session }
      );
      createdResume.educationIds = educationDocs.map(doc => doc._id);
    }

    // 3. Create or update skills
    if (req.body.skills?.length) {
      const skillIds = [];
      for (const skill of req.body.skills) {
        // Find or create base skill
        const baseSkill = await Skill.findOneAndUpdate(
          { name: skill.skillName },
          { 
            $inc: { popularity: 1 },
            $setOnInsert: {
              category: skill.category,
              description: skill.description
            }
          },
          { upsert: true, new: true, session }
        );

        // Find or create user-specific skill
        const userSkill = await UserSkill.findOneAndUpdate(
          { 
            user: req.user._id,
            skill: baseSkill._id
          },
          {
            description: skill.description,
            skillLevel: skill.skillLevel,
            isPublic: skill.isPublic || false,
            visible: skill.visible !== false
          },
          { upsert: true, new: true, session }
        );

        skillIds.push(userSkill._id);
      }
      createdResume.skillIds = skillIds;
    }

    // 4. Create experience entries
    if (req.body.experience?.length) {
      const experienceDocs = await Experience.insertMany(
        req.body.experience.map(exp => ({
          user: req.user._id,
          jobTitle: exp.jobTitle,
          company: exp.company,
          yearsWorked: exp.yearsWorked,
          description: exp.description,
          isPublic: exp.isPublic || false,
          visible: exp.visible !== false,
          industry: exp.industry,
          location: exp.location
        })),
        { session }
      );
      createdResume.experienceIds = experienceDocs.map(doc => doc._id);
    }

    // 5. Create project entries
    if (req.body.projects?.length) {
      const projectDocs = [];
      for (const proj of req.body.projects) {
        // Create or get skill documents for techStack
        const techStackIds = [];
        if (proj.techStack?.length) {
          for (const techName of proj.techStack) {
            const skill = await Skill.findOneAndUpdate(
              { name: techName },
              { 
                $inc: { popularity: 1 },
                $setOnInsert: {
                  category: 'Technology',
                  description: `Skill in ${techName}`
                }
              },
              { upsert: true, new: true, session }
            );
            techStackIds.push(skill._id);
          }
        }

        // Create project document
        const project = await Project.create([{
          user: req.user._id,
          projectName: proj.projectName,
          description: proj.description,
          techStack: techStackIds,
          role: proj.role,
          additionalInfo: proj.additionalInfo,
          isPublic: proj.isPublic || false,
          visible: proj.visible !== false,
          startDate: proj.startDate,
          endDate: proj.endDate,
          status: proj.status || 'completed',
          category: proj.category,
          teamSize: proj.teamSize,
          links: proj.links,
          highlights: proj.highlights
        }], { session });

        projectDocs.push(project[0]);
      }
      createdResume.projectIds = projectDocs.map(doc => doc._id);
    }

    // Save the updated resume with all references
    await createdResume.save({ session });

    // Populate resume with session before committing
    const populatedResume = await createdResume.populateAll(session);
    
    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json(populatedResume);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const resumes = await Resume.find({ user: req.user._id }).session(session);
    const populatedResumes = await Promise.all(
      resumes.map(resume => resume.populateAll(session))
    );
    res.json(populatedResumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    }).session(session);

    if (resume) {
      const populatedResume = await resume.populateAll(session);
      res.json(populatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Handle profile picture update
    if (req.file) {
      if (resume.personalDetails.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(resume.personalDetails.profilePicture.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'resume-builder/profile-pictures',
        width: 300,
        crop: 'scale'
      });

      req.body.personalDetails = {
        ...req.body.personalDetails,
        profilePicture: {
          url: result.secure_url,
          publicId: result.public_id
        }
      };
    }

    // Update main resume data
    resume.personalDetails = req.body.personalDetails;
    resume.address = req.body.address;
    resume.professionalSummary = req.body.professionalSummary;
    resume.isTemplate = req.body.isTemplate || false;
    resume.templateName = req.body.templateName;
    resume.visibility = req.body.visibility || 'private';

    // Update education entries
    if (req.body.education?.length) {
      // Delete old education entries
      await Education.deleteMany({ 
        _id: { $in: resume.educationIds },
        user: req.user._id
      }, { session });

      // Create new education entries
      const educationDocs = await Education.insertMany(
        req.body.education.map(edu => ({
          user: req.user._id,
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          description: edu.description,
          visible: edu.visible !== false,
          isPublic: edu.isPublic || false
        })),
        { session }
      );
      resume.educationIds = educationDocs.map(doc => doc._id);
    }

    // Update skills
    if (req.body.skills?.length) {
      // Delete old user skills
      await UserSkill.deleteMany({
        _id: { $in: resume.skillIds },
        user: req.user._id
      }, { session });

      const skillIds = [];
      for (const skill of req.body.skills) {
        // Find or create base skill
        const baseSkill = await Skill.findOneAndUpdate(
          { name: skill.skillName },
          { 
            $inc: { popularity: 1 },
            $setOnInsert: {
              category: skill.category,
              description: skill.description
            }
          },
          { upsert: true, new: true, session }
        );

        // Find or create user-specific skill
        const userSkill = await UserSkill.findOneAndUpdate(
          { 
            user: req.user._id,
            skill: baseSkill._id
          },
          {
            description: skill.description,
            skillLevel: skill.skillLevel,
            isPublic: skill.isPublic || false,
            visible: skill.visible !== false
          },
          { upsert: true, new: true, session }
        );

        skillIds.push(userSkill._id);
      }
      resume.skillIds = skillIds;
    }

    // Update experience entries
    if (req.body.experience?.length) {
      await Experience.deleteMany({
        _id: { $in: resume.experienceIds },
        user: req.user._id
      }, { session });

      const experienceDocs = await Experience.insertMany(
        req.body.experience.map(exp => ({
          user: req.user._id,
          jobTitle: exp.jobTitle,
          company: exp.company,
          yearsWorked: exp.yearsWorked,
          description: exp.description,
          isPublic: exp.isPublic || false,
          visible: exp.visible !== false,
          industry: exp.industry,
          location: exp.location
        })),
        { session }
      );
      resume.experienceIds = experienceDocs.map(doc => doc._id);
    }

    // Update project entries
    if (req.body.projects?.length) {
      await Project.deleteMany({
        _id: { $in: resume.projectIds },
        user: req.user._id
      }, { session });

      const projectDocs = [];
      for (const proj of req.body.projects) {
        // Create or get skill documents for techStack
        const techStackIds = [];
        if (proj.techStack?.length) {
          for (const techName of proj.techStack) {
            const skill = await Skill.findOneAndUpdate(
              { name: techName },
              { 
                $inc: { popularity: 1 },
                $setOnInsert: {
                  category: 'Technology',
                  description: `Skill in ${techName}`
                }
              },
              { upsert: true, new: true, session }
            );
            techStackIds.push(skill._id);
          }
        }

        // Create project document
        const project = await Project.create([{
          user: req.user._id,
          projectName: proj.projectName,
          description: proj.description,
          techStack: techStackIds,
          role: proj.role,
          additionalInfo: proj.additionalInfo,
          isPublic: proj.isPublic || false,
          visible: proj.visible !== false,
          startDate: proj.startDate,
          endDate: proj.endDate,
          status: proj.status || 'completed',
          category: proj.category,
          teamSize: proj.teamSize,
          links: proj.links,
          highlights: proj.highlights
        }], { session });

        projectDocs.push(project[0]);
      }
      resume.projectIds = projectDocs.map(doc => doc._id);
    }

    // Save the updated resume
    await resume.save({ session });

    // Populate resume with session before committing
    const populatedResume = await resume.populateAll(session);
    
    // Commit transaction
    await session.commitTransaction();
    
    res.json(populatedResume);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (resume) {
      // Delete image from cloudinary if exists
      if (resume.personalDetails.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(resume.personalDetails.profilePicture.publicId);
      }

      // Delete all related documents
      await Promise.all([
        Education.deleteMany({ _id: { $in: resume.educationIds }, user: req.user._id }, { session }),
        UserSkill.deleteMany({ _id: { $in: resume.skillIds }, user: req.user._id }, { session }),
        Experience.deleteMany({ _id: { $in: resume.experienceIds }, user: req.user._id }, { session }),
        Project.deleteMany({ _id: { $in: resume.projectIds }, user: req.user._id }, { session }),
        resume.deleteOne({ session })
      ]);

      await session.commitTransaction();
      res.json({ message: 'Resume and all related data removed successfully' });
    } else {
      await session.abortTransaction();
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};
