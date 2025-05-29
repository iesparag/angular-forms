import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  category: { 
    type: String,
    index: true
  },
  description: String,
  popularity: { 
    type: Number, 
    default: 0 
  },
  // For organizing skills hierarchically
  parentSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  // For skill verification
  verificationCriteria: {
    assessmentRequired: { type: Boolean, default: false },
    certificationRequired: { type: Boolean, default: false },
    endorsementsRequired: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Separate schema for user-specific skill details
const userSkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  description: String,
  skillLevel: { 
    type: Number,
    min: 1,
    max: 10
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  endorsements: { 
    type: Number, 
    default: 0 
  },
  endorsedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    verificationUrl: String
  }],
  visible: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Index for searching skills
skillSchema.index({ 
  name: 'text', 
  category: 'text', 
  description: 'text' 
});

userSkillSchema.index({ user: 1, skill: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);
const UserSkill = mongoose.model('UserSkill', userSkillSchema);

export { Skill, UserSkill };
