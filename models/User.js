import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sport: { type: String, required: true },
  role: { type: String, enum: ['COACH', 'SCOUT', 'PLAYER'], default: 'PLAYER' },
  academy: { type: String, default: 'Dumka Sports Academy' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);