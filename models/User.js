import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['COACH', 'SCOUT', 'PLAYER'], default: 'PLAYER' },
  age: { type: Number },
  sport: { type: String },
  academy: { type: String, default: 'Dumka Sports Academy' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);