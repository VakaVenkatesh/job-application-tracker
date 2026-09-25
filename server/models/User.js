const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  // Profile & Aspirant Details
  headline: {
    type: String,
    default: 'Software Engineer & Tech Enthusiast'
  },
  bio: {
    type: String,
    default: ''
  },
  targetRole: {
    type: String,
    default: 'Fullstack Developer'
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', 'lead'],
    default: 'junior'
  },
  skills: {
    type: [String],
    default: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git']
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Bengaluru, India'
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  preferredJobTypes: {
    type: [String],
    default: ['full_time', 'freelance', 'contract']
  },
  preferredLocations: {
    type: [String],
    default: ['Remote', 'Hybrid', 'Bengaluru', 'San Francisco']
  },
  expectedSalary: {
    type: String,
    default: '$80,000 - $120,000 / yr'
  },
  avatarColor: {
    type: String,
    default: '#00f5a0'
  }
}, { timestamps: true });

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate Solo Leveling style Hunter Rank & Level dynamically
userSchema.methods.getHunterStats = function(applicationsCount = 0) {
  const skillCount = this.skills ? this.skills.length : 0;
  const expPoints = (skillCount * 15) + (applicationsCount * 25);
  const level = Math.max(1, Math.floor(expPoints / 50) + 1);

  let rank = 'E-Rank';
  let rankTitle = 'Novice Hunter';
  let rankColor = '#94a3b8';

  if (level >= 30 || skillCount >= 15) {
    rank = 'S-Rank';
    rankTitle = 'Shadow Monarch';
    rankColor = '#a855f7';
  } else if (level >= 20 || skillCount >= 12) {
    rank = 'A-Rank';
    rankTitle = 'Elite Guild Striker';
    rankColor = '#ef4444';
  } else if (level >= 12 || skillCount >= 8) {
    rank = 'B-Rank';
    rankTitle = 'Raid Vanguard';
    rankColor = '#eab308';
  } else if (level >= 6 || skillCount >= 5) {
    rank = 'C-Rank';
    rankTitle = 'Dungeon Specialist';
    rankColor = '#00f5a0';
  } else if (level >= 3) {
    rank = 'D-Rank';
    rankTitle = 'Apprentice Scout';
    rankColor = '#38bdf8';
  }

  return {
    level,
    rank,
    rankTitle,
    rankColor,
    exp: expPoints % 50,
    nextLevelExp: 50,
    totalSkills: skillCount,
    combatPower: (skillCount * 450) + (level * 800)
  };
};

module.exports = mongoose.model('User', userSchema);
