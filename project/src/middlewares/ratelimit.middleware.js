const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = generalLimiter;
