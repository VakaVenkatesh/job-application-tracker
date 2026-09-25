const express = require('express');
const router = express.Router();
const { fetchRemotive, fetchArbeitnow, seedDatabase, importJob } = require('../controllers/syncController');

// GET /api/sync/fetch-live?source=remotive|arbeitnow
router.get('/fetch-live', (req, res, next) => {
  const source = req.query.source || 'remotive';
  if (source === 'arbeitnow') {
    return fetchArbeitnow(req, res, next);
  }
  return fetchRemotive(req, res, next);
});

router.get('/remotive', fetchRemotive);
router.get('/arbeitnow', fetchArbeitnow);
router.post('/seed', seedDatabase);
router.post('/import', importJob);

module.exports = router;
