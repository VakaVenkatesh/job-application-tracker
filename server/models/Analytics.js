const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date:           { type: Date, default: Date.now, index: true },
  totalApps:      { type: Number, default: 0 },
  byStage: {
    wishlist:      { type: Number, default: 0 },
    applied:       { type: Number, default: 0 },
    screening:     { type: Number, default: 0 },
    interviewing:  { type: Number, default: 0 },
    offer:         { type: Number, default: 0 },
    accepted:      { type: Number, default: 0 },
    rejected:      { type: Number, default: 0 },
    ghosted:       { type: Number, default: 0 }
  },
  responseRate:         { type: Number, default: 0 },
  avgDaysToReply:       { type: Number, default: 0 },
  topCompanies:         [{ company: String, count: Number }],
  weeklyApplied:        { type: Number, default: 0 },
  coldEmailsSent:       { type: Number, default: 0 },
  coldEmailResponseRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
