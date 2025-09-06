import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quiz_completed: {
    type: Boolean,
    default: false,
  },
  quiz_answers: [{
    type: Number,
  }],
  quiz_completed_at: {
    type: Date,
  },
  qdrant_point_id: {  // ✅ ADD THIS FIELD
    type: String,
  },
  matched_planet: {
    type: Object,
  },
  planet_matched: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
