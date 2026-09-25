const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/authMiddleware');
const { getDashboard, getTimeline, getStageDistribution } = require('../controllers/analyticsController');

// Extract user from JWT if token is provided
router.use(optionalProtect);

// GET /api/analytics - Dashboard metrics
router.get('/', getDashboard);
router.get('/dashboard', getDashboard);
router.get('/timeline', getTimeline);
router.get('/stages', getStageDistribution);

module.exports = router;
