const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { 
  advancedHelmetConfig, 
  customSecurityHeaders, 
  createAdvancedRateLimit, 
  securityMonitoring 
} = require('./advancedSecurity');

// XSS protection function (replacing deprecated xss-clean)
const xssProtection = (req, res, next) => {
  // Simple XSS protection - replace dangerous patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<.*?style\s*=.*?expression\s*\(.*?\)/gi
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      let sanitized = value;
      xssPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      return sanitized;
    } else if (typeof value === 'object' && value !== null) {
      const sanitizedObj = {};
      for (const [key, val] of Object.entries(value)) {
        sanitizedObj[key] = sanitizeValue(val);
      }
      return sanitizedObj;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// Advanced rate limiting configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users in production
      return req.user && req.user.role === 'admin';
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    },
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip
  });
};

// Enhanced rate limiting configurations using advanced rate limit
const generalLimiter = rateLimit(createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later'
}));

const authLimiter = rateLimit(createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: 'Too many authentication attempts, please try again later'
}));

const uploadLimiter = rateLimit(createAdvancedRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Upload limit exceeded, please try again later'
}));

// Enhanced security headers configuration
const securityHeaders = [advancedHelmetConfig, customSecurityHeaders];

// Input validation and sanitization
const inputSanitization = [
  mongoSanitize({
    replaceWith: '_'
  }),
  xssProtection, // Our custom XSS protection
  hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  })
];

// Request size limits
const requestLimits = (req, res, next) => {
  // Limit request size based on content type
  const maxSizes = {
    'application/json': '10mb',
    'multipart/form-data': '50mb',
    'application/x-www-form-urlencoded': '10mb'
  };

  const contentType = req.get('content-type');
  if (contentType) {
    const baseType = contentType.split(';')[0];
    const maxSize = maxSizes[baseType];
    if (maxSize) {
      req.rawBody = '';
      req.setEncoding('utf8');
      req.on('data', chunk => {
        req.rawBody += chunk;
        if (req.rawBody.length > parseInt(maxSize)) {
          res.status(413).json({
            success: false,
            message: 'Request entity too large'
          });
          return;
        }
      });
    }
  }
  next();
};

// CORS security configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://www.boholtraveltips.com',
      'https://boholtraveltips.com',
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  maxAge: 86400 // 24 hours
};

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
  inputSanitization,
  requestLimits,
  corsOptions,
  xssProtection,
  securityMonitoring
};
