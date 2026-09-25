const axios = require('axios');
const { stripHtml } = require('../utils/htmlToText');

const REMOTIVE_URL = 'https://remotive.com/api/remote-jobs';

const JOB_TYPE_MAP = {
  full_time: 'full_time',
  part_time: 'part_time',
  contract: 'contract',
  freelance: 'freelance',
  internship: 'internship',
  other: 'other'
};

/**
 * Transform a Remotive API job object into our Application schema shape
 */
function transformRemotiveJob(job) {
  return {
    title:          job.title || 'Untitled',
    company:        job.company_name || 'Unknown',
    companyLogo:    job.company_logo_url || job.company_logo || '',
    location:       job.candidate_required_location || 'Remote',
    jobUrl:         job.url || '',
    salary:         job.salary || '',
    jobType:        JOB_TYPE_MAP[job.job_type] || 'other',
    category:       job.category || '',
    tags:           Array.isArray(job.tags) ? job.tags : [],
    description:    stripHtml(job.description),
    stage:          'wishlist',
    source:         'remotive',
    externalId:     String(job.id),
    dateDiscovered: job.publication_date ? new Date(job.publication_date) : new Date(),
    priority:       3,
    excitement:     3,
    contacts:       [],
    notes:          [],
    isArchived:     false
  };
}

/**
 * Fetch jobs from Remotive API and return transformed array
 */
async function fetchAndTransform(limit) {
  try {
    const params = {};
    if (limit) params.limit = limit;
    const { data } = await axios.get(REMOTIVE_URL, { params, timeout: 15000 });
    const jobs = data.jobs || [];
    console.log(`📡 Remotive: fetched ${jobs.length} jobs`);
    return jobs.map(transformRemotiveJob);
  } catch (error) {
    console.error('❌ Remotive API error:', error.message);
    return [];
  }
}

module.exports = { fetchAndTransform, transformRemotiveJob };
