const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get live dashboard metrics via aggregation pipeline
// @route   GET /api/analytics/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  // If user is not logged in, return base public metrics
  const totalOpenJobs = await JobPosting.countDocuments({ isActive: true });

  if (!req.user) {
    return res.json({
      success: true,
      data: {
        totalApps: 0,
        totalApplied: 0,
        responseRate: 0,
        avgDaysToReply: 0,
        weeklyApplied: 0,
        upcomingRoundsCount: 0,
        upcomingRounds: [],
        stageDistribution: [],
        topCompanies: [],
        totalOpenJobs
      }
    });
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const baseMatch = { user: userId, isArchived: false };

  // Stage distribution
  const stageDistribution = await Application.aggregate([
    { $match: baseMatch },
    { $group: { _id: '$stage', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Total counts
  const totalApps = await Application.countDocuments(baseMatch);
  const totalApplied = await Application.countDocuments({ ...baseMatch, stage: { $ne: 'wishlist' } });

  // Response rate
  const withResponse = await Application.countDocuments({
    ...baseMatch,
    stage: { $ne: 'wishlist' },
    dateResponse: { $ne: null }
  });
  const responseRate = totalApplied > 0 ? Math.round((withResponse / totalApplied) * 100) : 0;

  // Average days to reply
  const avgDaysResult = await Application.aggregate([
    {
      $match: {
        user: userId,
        isArchived: false,
        dateApplied: { $ne: null },
        dateResponse: { $ne: null }
      }
    },
    {
      $group: {
        _id: null,
        avgDays: {
          $avg: {
            $divide: [{ $subtract: ['$dateResponse', '$dateApplied'] }, 86400000]
          }
        }
      }
    }
  ]);
  const avgDaysToReply = avgDaysResult.length > 0 ? Math.round(avgDaysResult[0].avgDays) : 0;

  // Weekly applied count
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyApplied = await Application.countDocuments({
    user: userId,
    dateApplied: { $gte: startOfWeek }
  });

  // Upcoming exams, interviews & rounds
  const upcomingRounds = await Application.find({
    user: userId,
    isArchived: false,
    nextRoundDate: { $gte: now }
  })
  .sort({ nextRoundDate: 1 })
  .limit(5)
  .select('title company companyLogo nextRoundDate nextRoundType nextRoundNotes stage');

  const upcomingRoundsCount = await Application.countDocuments({
    user: userId,
    isArchived: false,
    nextRoundDate: { $gte: now }
  });

  // Top applied companies
  const topCompanies = await Application.aggregate([
    { $match: baseMatch },
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { company: '$_id', count: 1, _id: 0 } }
  ]);

  res.json({
    success: true,
    data: {
      totalApps,
      totalApplied,
      responseRate,
      avgDaysToReply,
      weeklyApplied,
      upcomingRoundsCount,
      upcomingRounds,
      stageDistribution,
      topCompanies,
      totalOpenJobs
    }
  });
});

// @desc    Get applications timeline
// @route   GET /api/analytics/timeline
const getTimeline = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({ success: true, data: [] });
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const timeline = await Application.aggregate([
    { $match: { user: userId, isArchived: false, dateApplied: { $ne: null } } },
    {
      $group: {
        _id: {
          year: { $year: '$dateApplied' },
          week: { $week: '$dateApplied' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
    { $limit: 12 }
  ]);

  res.json({ success: true, data: timeline });
});

// @desc    Get stage distribution
// @route   GET /api/analytics/stages
const getStageDistribution = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({ success: true, data: [] });
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const stages = await Application.aggregate([
    { $match: { user: userId, isArchived: false } },
    { $group: { _id: '$stage', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({ success: true, data: stages });
});

module.exports = { getDashboard, getTimeline, getStageDistribution };
