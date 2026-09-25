const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get live dashboard metrics via aggregation pipeline
// @route   GET /api/analytics/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  // Stage distribution
  const stageDistribution = await Application.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$stage', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Total counts
  const totalApps = await Application.countDocuments({ isArchived: false });
  const totalApplied = await Application.countDocuments({ isArchived: false, stage: { $ne: 'wishlist' } });

  // Response rate (apps that got a dateResponse vs total applied)
  const withResponse = await Application.countDocuments({
    isArchived: false,
    stage: { $ne: 'wishlist' },
    dateResponse: { $ne: null }
  });
  const responseRate = totalApplied > 0 ? Math.round((withResponse / totalApplied) * 100) : 0;

  // Average days to reply
  const avgDaysResult = await Application.aggregate([
    {
      $match: {
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

  // This week applications count
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyApplied = await Application.countDocuments({
    dateApplied: { $gte: startOfWeek }
  });

  // Top companies
  const topCompanies = await Application.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { company: '$_id', count: 1, _id: 0 } }
  ]);

  // Cold email stats
  const coldEmailsSent = await Application.countDocuments({
    'coldEmail.sent': true
  });

  // Source breakdown
  const sourceBreakdown = await Application.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalApps,
      totalApplied,
      responseRate,
      avgDaysToReply,
      weeklyApplied,
      coldEmailsSent,
      stageDistribution,
      topCompanies,
      sourceBreakdown
    }
  });
});

// @desc    Get applications timeline (grouped by week)
// @route   GET /api/analytics/timeline
const getTimeline = asyncHandler(async (req, res) => {
  const timeline = await Application.aggregate([
    { $match: { isArchived: false, dateDiscovered: { $ne: null } } },
    {
      $group: {
        _id: {
          year: { $year: '$dateDiscovered' },
          week: { $week: '$dateDiscovered' }
        },
        count: { $sum: 1 },
        applied: {
          $sum: { $cond: [{ $ne: ['$dateApplied', null] }, 1, 0] }
        }
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
  const stages = await Application.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$stage', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({ success: true, data: stages });
});

module.exports = { getDashboard, getTimeline, getStageDistribution };
