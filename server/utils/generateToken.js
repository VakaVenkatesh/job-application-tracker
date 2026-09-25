const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'job_application_tracker_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
