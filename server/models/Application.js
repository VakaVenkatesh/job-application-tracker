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
  category:     { type: String, default: '' },
  tags:         [{ type: String }],
  companyLogo:  { type: String, default: '' },
  description:  { type: String, default: '' },

  // Pipeline tracking
  stage: {
    type: String,
    enum: ['wishlist', 'applied', 'screening', 'interviewing', 'offer', 'accepted', 'rejected', 'ghosted'],
    default: 'wishlist',
    index: true
  },

  // Recruiter contacts (embedded)
  contacts: [contactSchema],

  // Notes & activity log
  notes: [noteSchema],

  // Cold email tracking
  coldEmail: {
    sent:         { type: Boolean, default: false },
    sentDate:     { type: Date },
    followUps:    { type: Number, default: 0 },
    lastFollowUp: { type: Date },
    template:     { type: String, default: '' }
  },

  // Key dates
  dateDiscovered: { type: Date, default: Date.now },
  dateApplied:    { type: Date },
  dateResponse:   { type: Date },
  nextFollowUp:   { type: Date },

  // Source tracking
  source: {
    type: String,
    enum: ['remotive', 'arbeitnow', 'manual', 'linkedin', 'indeed', 'other'],
    default: 'manual'
  },
  externalId: { type: String },

  // Priority & rating
  priority:   { type: Number, min: 1, max: 5, default: 3 },
  excitement: { type: Number, min: 1, max: 5, default: 3 },

  // Metadata
  isArchived: { type: Boolean, default: false }

}, { timestamps: true });

// Compound index for deduplication of imported jobs
applicationSchema.index({ externalId: 1, source: 1 }, { unique: true, sparse: true });

// Text index for full-text search
applicationSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Application', applicationSchema);
