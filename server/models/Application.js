const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:     { type: String, default: '' },
  email:    { type: String, default: '' },
  phone:    { type: String, default: '' },
  role:     { type: String, default: '' },
  linkedin: { type: String, default: '' },
  notes:    { type: String, default: '' }
}, { _id: true, timestamps: true });

const noteSchema = new mongoose.Schema({
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const applicationSchema = new mongoose.Schema({
  // User ownership
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobPosting:   { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },

  // Core job info
  title:        { type: String, required: true, index: true },
  company:      { type: String, required: true, index: true },
  location:     { type: String, default: 'Remote' },
  jobUrl:       { type: String, default: '' },
  salary:       { type: String, default: '' },
  jobType:      {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'freelance', 'internship', 'other'],
    default: 'full_time'
  },
  category:     { type: String, default: 'Engineering' },
  tags:         [{ type: String }],
  companyLogo:  { type: String, default: '' },
  description:  { type: String, default: '' },

  // Skills & matching insights
  requiredSkills: [{ type: String }],
  missingSkills:  [{ type: String }],
  matchScore:     { type: Number, default: 0 },

  // Pipeline tracking
  stage: {
    type: String,
    enum: ['wishlist', 'applied', 'screening', 'interviewing', 'offer', 'accepted', 'rejected', 'ghosted'],
    default: 'applied',
    index: true
  },

  // Exam / Interview Next Round Tracking
  nextRoundDate: { type: Date },
  nextRoundType: {
    type: String,
    enum: ['online_assessment', 'technical_interview', 'hr_screening', 'system_design', 'managerial', 'final_round', 'assignment', 'offer_discussion', 'none'],
    default: 'none'
  },
  nextRoundNotes: { type: String, default: '' },

  // Recruiter contacts
  contacts: [contactSchema],

  // Notes & logs
  notes: [noteSchema],

  // Key dates
  dateDiscovered: { type: Date, default: Date.now },
  dateApplied:    { type: Date, default: Date.now },
  dateResponse:   { type: Date },

  // Priority & rating
  priority:   { type: Number, min: 1, max: 5, default: 3 },
  excitement: { type: Number, min: 1, max: 5, default: 3 },

  // Metadata
  isArchived: { type: Boolean, default: false }

}, { timestamps: true });

// Text index for full-text search
applicationSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Application', applicationSchema);
