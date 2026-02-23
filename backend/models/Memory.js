import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['study', 'job', 'task', 'health', 'event', 'note'],
    default: 'note'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  eventTime: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    duration: String,
    mood: String,
    priority: String,
    location: String,
    people: [String],
    outcome: String
  }
}, {
  timestamps: true
});

// Indexes for fast queries
memorySchema.index({ createdAt: -1 });
memorySchema.index({ eventTime: -1 });
memorySchema.index({ category: 1 });
memorySchema.index({ tags: 1 });
memorySchema.index({ 'metadata.priority': 1 });

export default mongoose.model('Memory', memorySchema);
