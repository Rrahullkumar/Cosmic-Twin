// src/models/DailyPoll.js
import mongoose from 'mongoose';

const DailyPollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    },
    votedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for automatic cleanup
DailyPollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.DailyPoll || mongoose.model('DailyPoll', DailyPollSchema);
