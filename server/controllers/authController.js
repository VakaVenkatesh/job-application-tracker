const User = require('../models/User');
const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password
  });

  if (user) {
    const appsCount = await Application.countDocuments({ user: user._id });
    const hunterStats = user.getHunterStats ? user.getHunterStats(appsCount) : {};

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        skills: user.skills,
        hunterStats,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get JWT token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const appsCount = await Application.countDocuments({ user: user._id });
    const hunterStats = user.getHunterStats ? user.getHunterStats(appsCount) : {};

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        skills: user.skills,
        hunterStats,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current logged in user profile (compact)
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const appsCount = await Application.countDocuments({ user: user._id });
    const hunterStats = user.getHunterStats ? user.getHunterStats(appsCount) : {};

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        skills: user.skills,
        hunterStats
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get complete user profile with Hunter Rank & full portfolio
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Count user statistics for ranking
  const totalApps = await Application.countDocuments({ user: user._id, isArchived: false });
  const activeInterviews = await Application.countDocuments({
    user: user._id,
    stage: { $in: ['screening', 'interviewing'] },
    isArchived: false
  });
  const offersCount = await Application.countDocuments({
    user: user._id,
    stage: { $in: ['offer', 'accepted'] },
    isArchived: false
  });

  const hunterStats = user.getHunterStats(totalApps);

  res.json({
    success: true,
    data: {
      ...user.toObject(),
      hunterStats,
      activityStats: {
        totalApplications: totalApps,
        activeInterviews,
        offersCount
      }
    }
  });
});

// @desc    Update complete user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allowedFields = [
    'name', 'headline', 'bio', 'targetRole', 'experienceLevel', 'skills',
    'resumeUrl', 'phone', 'location', 'linkedin', 'github', 'portfolio',
    'preferredJobTypes', 'preferredLocations', 'expectedSalary', 'avatarColor'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();
  const totalApps = await Application.countDocuments({ user: user._id, isArchived: false });
  const hunterStats = updatedUser.getHunterStats(totalApps);

  res.json({
    success: true,
    data: {
      ...updatedUser.toObject(),
      hunterStats
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getProfile,
  updateProfile
};
