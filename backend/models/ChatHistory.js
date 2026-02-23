import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['user', 'agent'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  intent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient querying of user's chat history
chatHistorySchema.index({ userId: 1, timestamp: -1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
