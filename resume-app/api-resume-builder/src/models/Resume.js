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
      url: String
    }]
  },
  address: {
    houseNumber: { type: String, required: true },
    floor: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    landmark: String,
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true }
  }],
  experience: [{
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    yearsWorked: { type: String, required: true },
    description: { type: String, required: true }
  }],
  skills: [{
    skillName: { type: String, required: true },
    description: { type: String, required: true }
  }],
  projects: [{
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    role: { type: String, required: true },
    additionalInfo: [{
      key: String,
      value: String
    }]
  }]
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
