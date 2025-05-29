import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  degree: { 
    type: String, 
    required: true,
    index: true // For faster searches
  },
  institution: { 
    type: String, 
    required: true,
    index: true // For faster searches
  },
  year: { 
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
  }
}, {
  timestamps: true
});

// Index for searching education entries
educationSchema.index({ 
  degree: 'text', 
  institution: 'text', 
  description: 'text' 
});

const Education = mongoose.model('Education', educationSchema);
export default Education;
