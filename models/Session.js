import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sport: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'LOCKED'], default: 'OPEN' },
  attendance: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PRESENT', 'ABSENT'], required: true }
  }]
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);