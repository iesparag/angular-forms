import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: { 
    type: String, 
    required: true,
    index: true
  },
  description: { 
    type: String 
  },
  techStack: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  role: { 
    type: String 
  },
  additionalInfo: [{
    key: String,
    value: String
  }],
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
  // Additional fields for better project management
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'planned'],
    default: 'completed'
  },
  category: {
    type: String,
    index: true
  },
  teamSize: Number,
  links: [{
    type: {
      type: String,
      enum: ['github', 'demo', 'documentation', 'other']
    },
    url: String,
    description: String
  }],
  highlights: [String],
  // For collaborative projects
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }]
}, {
  timestamps: true
});

// Index for searching projects
projectSchema.index({ 
  projectName: 'text', 
  description: 'text',
  role: 'text',
  category: 'text',
  highlights: 'text'
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
