const axios = require('axios');
const { stripHtml } = require('../utils/htmlToText');

const ARBEITNOW_URL = 'https://www.arbeitnow.com/api/job-board-api';

/**
 * Transform an Arbeitnow API job object into our Application schema shape
 */
function transformArbeitnowJob(job) {
  // Determine job type from job_types array
  let jobType = 'other';
  if (Array.isArray(job.job_types)) {
    const types = job.job_types.map(t => t.toLowerCase());
    if (types.some(t => t.includes('full'))) jobType = 'full_time';
    else if (types.some(t => t.includes('part'))) jobType = 'part_time';
    else if (types.some(t => t.includes('contract'))) jobType = 'contract';
    else if (types.some(t => t.includes('freelance'))) jobType = 'freelance';
    else if (types.some(t => t.includes('intern') || t.includes('student') || t.includes('working student'))) jobType = 'internship';
  }

  return {
    title:          job.title || 'Untitled',
    company:        job.company_name || 'Unknown',
    companyLogo:    '',
    location:       job.location || (job.remote ? 'Remote' : 'On-site'),
    jobUrl:         job.url || '',
    salary:         '',
    jobType:        jobType,
    category:       Array.isArray(job.tags) && job.tags.length > 0 ? job.tags[0] : '',
    tags:           Array.isArray(job.tags) ? job.tags : [],
    description:    stripHtml(job.description),
    stage:          'wishlist',
    source:         'arbeitnow',
    externalId:     job.slug || String(job.created_at),
    dateDiscovered: job.created_at ? new Date(job.created_at * 1000) : new Date(),
    priority:       3,
    excitement:     3,
    contacts:       [],
    notes:          [],
    isArchived:     false
  };
}

/**
 * Fetch jobs from Arbeitnow API and return transformed array.
 * Only include remote/English jobs for better relevance.
 */
async function fetchAndTransform(limit) {
  try {
    const { data } = await axios.get(ARBEITNOW_URL, { timeout: 15000 });
    let jobs = data.data || [];

    // Filter to remote or English-tagged jobs for better relevance
    jobs = jobs.filter(j =>
      j.remote === true ||
      (Array.isArray(j.tags) && j.tags.some(t =>
        t.toLowerCase().includes('remote') || t.toLowerCase().includes('english')
      ))
    );

    if (limit) jobs = jobs.slice(0, limit);
    console.log(`📡 Arbeitnow: fetched ${jobs.length} relevant jobs`);
    return jobs.map(transformArbeitnowJob);
  } catch (error) {
    console.error('❌ Arbeitnow API error:', error.message);
    return [];
  }
}

module.exports = { fetchAndTransform, transformArbeitnowJob };
