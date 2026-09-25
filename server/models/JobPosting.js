const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    index: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Remote',
    index: true
  },
  salary: {
    type: String,
    default: '$80,000 - $120,000 / yr'
  },
  jobType: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'freelance', 'internship', 'other'],
    default: 'full_time',
    index: true
  },
  category: {
    type: String,
    default: 'Engineering',
    index: true
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', 'lead', 'any'],
    default: 'any'
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  jobUrl: {
    type: String,
    required: [true, 'Job application link is required']
  },
  source: {
    type: String,
    default: 'direct'
  },
  externalId: {
    type: String,
    sparse: true
  },
  applicantCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  deadline: {
    type: Date
  },
  postedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Compound and full-text indexes for search
jobPostingSchema.index({ title: 'text', company: 'text', description: 'text', requiredSkills: 'text' });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
