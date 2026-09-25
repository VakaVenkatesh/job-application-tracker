const asyncHandler = require('../middleware/asyncHandler');
const remotiveService = require('../services/remotiveService');
const arbeitnowService = require('../services/arbeitnowService');
const { seedIfEmpty } = require('../services/seedService');
const Application = require('../models/Application');

// @desc    Fetch latest jobs from Remotive API (for Discovery page)
// @route   GET /api/sync/remotive
const fetchRemotive = asyncHandler(async (req, res) => {
  const jobs = await remotiveService.fetchAndTransform();
  res.json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Fetch latest jobs from Arbeitnow API (for Discovery page)
// @route   GET /api/sync/arbeitnow
const fetchArbeitnow = asyncHandler(async (req, res) => {
  const jobs = await arbeitnowService.fetchAndTransform();
  res.json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Trigger database seeding manually
// @route   POST /api/sync/seed
const seedDatabase = asyncHandler(async (req, res) => {
  const seeded = await seedIfEmpty();
  res.json({ success: true, seeded });
});

// @desc    Import a specific external job into the pipeline
// @route   POST /api/sync/import
const importJob = asyncHandler(async (req, res) => {
  const jobData = req.body;

  // Check if already imported
  if (jobData.externalId && jobData.source) {
    const existing = await Application.findOne({
      externalId: jobData.externalId,
      source: jobData.source
    });
    if (existing) {
      res.status(400);
      throw new Error('This job has already been imported');
    }
  }

  const application = await Application.create({
    ...jobData,
    stage: 'wishlist',
    dateDiscovered: new Date()
  });

  res.status(201).json({ success: true, data: application });
});

module.exports = { fetchRemotive, fetchArbeitnow, seedDatabase, importJob };
