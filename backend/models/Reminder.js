import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  reminderTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'triggered', 'cancelled'],
    default: 'pending'
  },
  dismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  triggeredAt: Date
}, {
  timestamps: true
});

// Index for quick lookup of pending reminders
reminderSchema.index({ reminderTime: 1, status: 1 });

export default mongoose.model('Reminder', reminderSchema);
