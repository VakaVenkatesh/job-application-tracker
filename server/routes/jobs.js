const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  applyToJob,
  createJobPosting,
  getGlobalStats
} = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/stats/overview', getGlobalStats);
router.get('/', optionalProtect, getJobs);
router.get('/:id', optionalProtect, getJob);
router.post('/:id/apply', optionalProtect, applyToJob);
router.post('/', protect, createJobPosting);

module.exports = router;
