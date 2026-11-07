import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sport: { type: String, required: true },
  opponent: { type: String, required: true },
  academy: { type: String, default: 'Dumka Sports Academy' },
  playerScores: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, default: 0 }
  }]
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);