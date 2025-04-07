import Resume from '../models/Resume.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
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

    const resumeData = {
      user: req.user._id,
      ...req.body,
      personalDetails: {
        ...req.body.personalDetails,
        profilePicture: profilePictureData
      }
    };

    const resume = new Resume(resumeData);

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (resume) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (resume) {
      if (req.file) {
        // Delete old image from cloudinary if exists
        if (resume.personalDetails.profilePicture?.publicId) {
          await cloudinary.uploader.destroy(resume.personalDetails.profilePicture.publicId);
        }

        // Upload new image
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

      Object.assign(resume, req.body);
      const updatedResume = await resume.save();
      res.json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
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
      
      await resume.deleteOne();
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
