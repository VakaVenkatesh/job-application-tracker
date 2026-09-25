const JobPosting = require('../models/JobPosting');
const Application = require('../models/Application');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to calculate match score and missing skills
function computeSkillMatch(jobSkills = [], userSkills = []) {
  if (!jobSkills || jobSkills.length === 0) {
    return { matchScore: 100, matchedSkills: [], missingSkills: [] };
  }
  const lowerUserSkills = (userSkills || []).map(s => s.toLowerCase().trim());
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach(skill => {
    const sLower = skill.toLowerCase().trim();
    if (lowerUserSkills.some(uSkill => uSkill.includes(sLower) || sLower.includes(uSkill))) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  return { matchScore, matchedSkills, missingSkills };
}

// @desc    Get all job postings (with filters, search, skill matching)
// @route   GET /api/jobs
// @access  Public (Enhanced if authenticated)
const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    jobType,
    experienceLevel,
    location,
    sort,
    page = 1,
    limit = 20
  } = req.query;

  const query = { isActive: true };

  if (category && category !== 'all') {
    query.category = new RegExp(`^${category}$`, 'i');
  }

  if (jobType && jobType !== 'all') {
    query.jobType = jobType;
  }

  if (experienceLevel && experienceLevel !== 'all') {
    query.experienceLevel = experienceLevel;
  }

  if (location && location !== 'all') {
    if (location.toLowerCase() === 'remote') {
      query.location = /remote/i;
    } else {
      query.location = new RegExp(location, 'i');
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { requiredSkills: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  if (sort === 'oldest') sortOptions.postedAt = 1;
  else if (sort === 'popular') sortOptions.applicantCount = -1;
  else if (sort === 'company') sortOptions.company = 1;
  else sortOptions.postedAt = -1; // Default: newest first

  const total = await JobPosting.countDocuments(query);
  const jobs = await JobPosting.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // If user is authenticated, compute skill relevance for each job
  let userSkills = [];
  let userAppliedJobIds = new Set();

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user && user.skills) {
      userSkills = user.skills;
    }
    const userApps = await Application.find({ user: req.user._id, isArchived: false }).select('jobPosting jobUrl company title');
    userAppliedJobIds = new Set(userApps.map(a => a.jobPosting ? a.jobPosting.toString() : ''));
  }

  const enhancedJobs = jobs.map(job => {
    const jobObj = job.toObject();
    const { matchScore, matchedSkills, missingSkills } = computeSkillMatch(job.requiredSkills, userSkills);
    
    return {
      ...jobObj,
      matchScore: req.user ? matchScore : null,
      matchedSkills: req.user ? matchedSkills : [],
      missingSkills: req.user ? missingSkills : [],
      hasApplied: req.user ? userAppliedJobIds.has(job._id.toString()) : false
    };
  });

  res.json({
    success: true,
    count: enhancedJobs.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: enhancedJobs
  });
});

// @desc    Get single job posting with detailed relevance analysis
// @route   GET /api/jobs/:id
// @access  Public (Enhanced if authenticated)
const getJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job posting not found');
  }

  let userSkills = [];
  let userApplication = null;

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user && user.skills) {
      userSkills = user.skills;
    }
    userApplication = await Application.findOne({
      user: req.user._id,
      $or: [{ jobPosting: job._id }, { jobUrl: job.jobUrl }]
    });
  }

  const { matchScore, matchedSkills, missingSkills } = computeSkillMatch(job.requiredSkills, userSkills);

  res.json({
    success: true,
    data: {
      ...job.toObject(),
      matchScore: req.user ? matchScore : null,
      matchedSkills: req.user ? matchedSkills : [],
      missingSkills: req.user ? missingSkills : [],
      application: userApplication,
      hasApplied: !!userApplication
    }
  });
});

// @desc    Apply to a job posting (increments applicant count & adds to user's tracker)
// @route   POST /api/jobs/:id/apply
// @access  Public (or Private if logged in)
const applyToJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job posting not found');
  }

  // Atomically increment applicant count in DB
  job.applicantCount = (job.applicantCount || 0) + 1;
  await job.save();

  let application = null;

  // If user is authenticated, track this in their applications
  if (req.user) {
    const user = await User.findById(req.user._id);
    const { matchScore, missingSkills } = computeSkillMatch(job.requiredSkills, user ? user.skills : []);

    // Check if application already exists
    const existing = await Application.findOne({
      user: req.user._id,
      $or: [{ jobPosting: job._id }, { jobUrl: job.jobUrl }]
    });

    if (existing) {
      application = existing;
    } else {
      application = await Application.create({
        user: req.user._id,
        jobPosting: job._id,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.location,
        jobUrl: job.jobUrl,
        salary: job.salary,
        jobType: job.jobType,
        category: job.category,
        tags: job.tags,
        requiredSkills: job.requiredSkills,
        missingSkills: missingSkills,
        matchScore: matchScore,
        stage: 'applied',
        dateApplied: new Date(),
        priority: 4,
        excitement: 4
      });
    }
  }

  res.json({
    success: true,
    message: 'Application recorded successfully',
    applicantCount: job.applicantCount,
    jobUrl: job.jobUrl,
    application
  });
});

// @desc    Create new job posting (Direct recruiter / community posting)
// @route   POST /api/jobs
// @access  Private
const createJobPosting = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    companyLogo,
    companyWebsite,
    location,
    salary,
    jobType,
    category,
    experienceLevel,
    requiredSkills,
    tags,
    description,
    jobUrl
  } = req.body;

  if (!title || !company || !jobUrl) {
    res.status(400);
    throw new Error('Please provide title, company, and application URL');
  }

  // Auto-generate logo via clearbit/domain if logo is empty
  let logo = companyLogo || '';
  if (!logo && companyWebsite) {
    try {
      const domain = companyWebsite.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
      logo = `https://logo.clearbit.com/${domain}`;
    } catch (e) {}
  } else if (!logo) {
    const cleanName = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    logo = `https://logo.clearbit.com/${cleanName}.com`;
  }

  const job = await JobPosting.create({
    title,
    company,
    companyLogo: logo,
    companyWebsite: companyWebsite || '',
    location: location || 'Remote',
    salary: salary || 'Competitive',
    jobType: jobType || 'full_time',
    category: category || 'Engineering',
    experienceLevel: experienceLevel || 'any',
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(s => s.trim()) : []),
    description: description || '',
    jobUrl,
    source: 'community'
  });

  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Get global statistics (Real-time active jobs, total applications, companies)
// @route   GET /api/jobs/stats/overview
// @access  Public
const getGlobalStats = asyncHandler(async (req, res) => {
  const totalJobs = await JobPosting.countDocuments({ isActive: true });
  const totalApplications = await Application.countDocuments();
  const remoteJobs = await JobPosting.countDocuments({ isActive: true, location: /remote/i });
  const distinctCompanies = await JobPosting.distinct('company');

  res.json({
    success: true,
    data: {
      totalJobs,
      totalApplications,
      remoteJobs,
      totalCompanies: distinctCompanies.length
    }
  });
});

module.exports = {
  getJobs,
  getJob,
  applyToJob,
  createJobPosting,
  getGlobalStats
};
