const express = require('express');
const router = express.Router();
const { getDashboard, getTimeline, getStageDistribution } = require('../controllers/analyticsController');

// GET /api/analytics - Main dashboard metrics
router.get('/', getDashboard);
router.get('/dashboard', getDashboard);
router.get('/timeline', getTimeline);
router.get('/stages', getStageDistribution);

module.exports = router;
