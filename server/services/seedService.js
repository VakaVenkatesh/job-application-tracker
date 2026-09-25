const Application = require('../models/Application');
const remotiveService = require('./remotiveService');
const arbeitnowService = require('./arbeitnowService');

/**
 * Seeds the database with real jobs from live APIs if it is empty.
 * Called once on server startup.
 */
async function seedIfEmpty() {
  try {
    const count = await Application.countDocuments();
    if (count > 0) {
      console.log(`📦 Database has ${count} applications — skipping seed`);
      return false;
    }

    console.log('📡 Database empty — seeding from live APIs...');

    // Fetch from both APIs in parallel
    const [remotiveJobs, arbeitnowJobs] = await Promise.all([
      remotiveService.fetchAndTransform(),
      arbeitnowService.fetchAndTransform(15)
    ]);

    const allJobs = [...remotiveJobs, ...arbeitnowJobs];

    if (allJobs.length === 0) {
      console.log('⚠️  No jobs fetched from APIs — database remains empty');
      return false;
    }

    // Distribute some jobs across different stages for a realistic demo experience
    const stages = ['wishlist', 'applied', 'screening', 'interviewing', 'offer'];
    allJobs.forEach((job, i) => {
      if (i < 5) {
        job.stage = 'applied';
        job.dateApplied = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      } else if (i < 8) {
        job.stage = 'screening';
        job.dateApplied = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
      } else if (i < 10) {
        job.stage = 'interviewing';
        job.dateApplied = new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000);
        job.dateResponse = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      } else if (i < 11) {
        job.stage = 'offer';
        job.dateApplied = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        job.dateResponse = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
      }
      // Rest stay as 'wishlist'
    });

    // Use insertMany with ordered:false to skip duplicates gracefully
    const result = await Application.insertMany(allJobs, { ordered: false });
    console.log(`✅ Seeded ${result.length} jobs from live APIs`);
    return true;
  } catch (error) {
    // Duplicate key errors are expected if re-seeding — only log unexpected ones
    if (error.code === 11000 || (error.writeErrors && error.writeErrors.length > 0)) {
      const inserted = error.insertedDocs ? error.insertedDocs.length : 'some';
      console.log(`✅ Seeded ${inserted} jobs (duplicates skipped)`);
      return true;
    }
    console.error('❌ Seed error:', error.message);
    return false;
  }
}

module.exports = { seedIfEmpty };
