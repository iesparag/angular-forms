import mongoose from 'mongoose';

const SheetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  emails: {
    type: [String],
    required: true,
    validate: {
      validator: function(emails) {
        return emails.length > 0;
      },
      message: 'At least one email is required'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Making it optional for now
  }
}, {
  timestamps: true
});

const Sheet = mongoose.model('Sheet', SheetSchema);

export default Sheet;
