const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  age: Number,
  sport: String,
  academy: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  await User.create([
    {
      name: 'Coach Sharma',
      email: 'coach@dumka.org',
      password: hashedPassword,
      role: 'COACH',
      academy: 'Dumka Sports Academy'
    },
    {
      name: 'Scout Talent Officer',
      email: 'scout@jharkhand.org',
      password: hashedPassword,
      role: 'SCOUT',
      academy: 'Dumka Sports Academy'
    },
    {
      name: 'Ramesh Marandi',
      email: 'ramesh@dumka.org',
      password: hashedPassword,
      role: 'PLAYER',
      age: 17,
      sport: 'Archery',
      academy: 'Dumka Sports Academy'
    }
  ]);

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();