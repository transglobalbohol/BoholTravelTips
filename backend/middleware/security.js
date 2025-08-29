const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const NodeCache = require('node-cache');

const rateLimitCache = new NodeCache({ stdTTL: 900, checkperiod: 60 });

const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      let sanitized = value;
      for (const pattern of xssPatterns) {
        sanitized = sanitized.replace(pattern, '');
      }
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

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
};

const createOptimizedRateLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: { success: false, message: options.message },
    standardHeaders: false,
    legacyHeaders: false,
    
    store: {
      incr: (key, cb) => {
        const current = rateLimitCache.get(key) || 0;
        const newValue = current + 1;
        rateLimitCache.set(key, newValue, Math.ceil(options.windowMs / 1000));
        cb(null, newValue, new Date(Date.now() + options.windowMs));
      },
      resetKey: (key) => rateLimitCache.del(key)
    },
    
    skip: (req) => req.user?.role === 'admin',
    keyGenerator: (req) => req.ip
  });
};

const generalLimiter = createOptimizedRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Rate limit exceeded'
});

const authLimiter = createOptimizedRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts'
});

const uploadLimiter = createOptimizedRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'Upload limit exceeded'
});

const securityHeaders = helmet({
  dnsPrefetchControl: false,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: false
});

const inputSanitization = [
  mongoSanitize({ replaceWith: '_' }),
  xssProtection,
  hpp({ whitelist: ['sort', 'fields', 'page', 'limit', 'category'] })
];

const requestLimits = (req, res, next) => {
  req.setTimeout(15000, () => {
    res.status(408).json({ success: false, message: 'Request timeout' });
  });
  next();
};

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
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
};

const securityMonitoring = (req, res, next) => {
  const suspiciousPatterns = [/\.\.\//, /<script/i, /union.*select/i];
  const requestString = JSON.stringify({ url: req.url, body: req.body });
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      console.warn('Suspicious request:', req.ip, req.url);
      break;
    }
  }
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
  inputSanitization,
  requestLimits,
  corsOptions,
  securityMonitoring,
  rateLimitCache
};
