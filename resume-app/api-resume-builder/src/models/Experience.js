import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: { 
    type: String, 
    required: true,
    index: true // For faster searches
  },
  company: { 
    type: String, 
    required: true,
    index: true // For faster searches
  },
  yearsWorked: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  useCount: { 
    type: Number, 
    default: 1 
  },
  visible: { 
    type: Boolean, 
    default: true 
  },
  // Additional fields for better suggestions
  industry: String,
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  location: String
}, {
  timestamps: true
});

// Index for searching experience entries
experienceSchema.index({ 
  jobTitle: 'text', 
  company: 'text', 
  description: 'text',
  industry: 'text' 
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
