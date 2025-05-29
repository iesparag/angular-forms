import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profilePicture: {
      url: String,
      publicId: String
    },
    socialLinks: [{
      platform: String,
      url: String,
      visible: { type: Boolean, default: true }
    }]
  },
  address: {
    houseNumber: { type: String },
    floor: String,
    street: String,
    city: String,
    landmark: String,
    state: String,
    country: String
  },
  professionalSummary: String,
  // References to other collections
  educationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Education'
  }],
  experienceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  skillIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSkill'
  }],
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isTemplate: { type: Boolean, default: false },
  title: { type: String, required: true },
  templateName: String,
  visibility: {
    type: String,
    enum: ['private', 'public', 'template'],
    default: 'private'
  }
}, {
  timestamps: true
});

// Method to populate all references
resumeSchema.methods.populateAll = async function(session) {
  const populateOptions = [
    { 
      path: 'educationIds',
      select: 'degree institution year description visible'
    },
    {
      path: 'skillIds',
      populate: {
        path: 'skill',
        select: 'name category description'
      },
      select: 'description skillLevel visible'
    },
    {
      path: 'experienceIds',
      select: 'jobTitle company yearsWorked description visible industry location'
    },
    {
      path: 'projectIds',
      populate: {
        path: 'techStack',
        select: 'name category'
      },
      select: 'projectName description role additionalInfo visible status category teamSize links highlights'
    }
  ];

  return await this.populate(populateOptions);
};

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
