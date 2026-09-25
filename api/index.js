const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../server/config/db');
const errorHandler = require('../server/middleware/errorHandler');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://job-application-tracker-p2oh.onrender.com',
  'https://job-application-tracker-black-nine.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Ensure Database Connection for Serverless Requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel handler:', err);
  }
  next();
});

// API Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/applications', require('../server/routes/applications'));
app.use('/api/analytics', require('../server/routes/analytics'));
app.use('/api/sync', require('../server/routes/sync'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
