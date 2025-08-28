const { body, param, query, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const validator = require('validator');

// For server-side DOMPurify, we need jsdom
let purify;
try {
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  purify = DOMPurify(window);
  console.log('DOMPurify with jsdom initialized successfully');
} catch (error) {
  // Fallback if jsdom is not available
  console.warn('jsdom not available, using basic HTML sanitization');
  console.warn('Install jsdom with: npm install jsdom');
  purify = null;
}

// Custom validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// SQL injection patterns to detect and block
const sqlInjectionPatterns = [
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
  /(\b(or|and)\b\s+(\d+\s*=\s*\d+|true|false))/i,
  /(--|\/\*|\*\/|;)/,
  /(\b(script|javascript|vbscript|onload|onerror|onclick)\b)/i
];

// XSS patterns to detect and block
const xssPatterns = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<.*?style\s*=.*?expression\s*\(.*?\)/gi
];

// NoSQL injection patterns
const nosqlInjectionPatterns = [
  /\$where/i,
  /\$ne/i,
  /\$regex/i,
  /\$gt/i,
  /\$lt/i,
  /\$or/i,
  /\$and/i
];

// Check for injection patterns
const detectInjection = (input, patterns, type) => {
  if (typeof input !== 'string') return false;
  
  return patterns.some(pattern => {
    const match = pattern.test(input);
    if (match) {
      console.warn(`Potential ${type} injection detected:`, input);
    }
    return match;
  });
};

// Comprehensive input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // HTML sanitization with fallback
  let sanitized;
  if (purify) {
    sanitized = purify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  } else {
    // Basic HTML tag removal as fallback
    sanitized = input.replace(/<[^>]*>/g, '');
  }
  
  // Additional sanitization
  sanitized = validator.escape(sanitized);
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
};

// Deep sanitization for nested objects
const deepSanitize = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  } else if (obj && typeof obj === 'object') {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitizedObj[key] = deepSanitize(value);
    }
    return sanitizedObj;
  }
  return obj;
};

// Input validation and sanitization middleware
const validateAndSanitize = (req, res, next) => {
  try {
    // Check for injection attacks in all inputs
    const checkAllInputs = (obj) => {
      for (const [key, value] of Object.entries(obj || {})) {
        if (typeof value === 'string') {
          if (detectInjection(value, sqlInjectionPatterns, 'SQL')) {
            return res.status(400).json({
              success: false,
              message: 'Potential SQL injection detected'
            });
          }
          if (detectInjection(value, xssPatterns, 'XSS')) {
            return res.status(400).json({
              success: false,
              message: 'Potential XSS attack detected'
            });
          }
          if (detectInjection(value, nosqlInjectionPatterns, 'NoSQL')) {
            return res.status(400).json({
              success: false,
              message: 'Potential NoSQL injection detected'
            });
          }
        }
      }
    };

    checkAllInputs(req.body);
    checkAllInputs(req.query);
    checkAllInputs(req.params);

    // Sanitize all inputs
    if (req.body) {
      req.body = deepSanitize(req.body);
    }
    if (req.query) {
      req.query = deepSanitize(req.query);
    }
    if (req.params) {
      req.params = deepSanitize(req.params);
    }

    next();
  } catch (error) {
    console.error('Input validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Input validation error'
    });
  }
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  password: body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
    
  name: body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  phone: body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  url: body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid URL'),
    
  text: (fieldName, min = 1, max = 1000) => 
    body(fieldName)
      .trim()
      .isLength({ min, max })
      .withMessage(`${fieldName} must be between ${min} and ${max} characters`),
      
  number: (fieldName, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    body(fieldName)
      .isNumeric()
      .withMessage(`${fieldName} must be a number`)
      .custom(value => {
        const num = parseFloat(value);
        if (num < min || num > max) {
          throw new Error(`${fieldName} must be between ${min} and ${max}`);
        }
        return true;
      }),
      
  date: (fieldName) =>
    body(fieldName)
      .isISO8601()
      .withMessage(`${fieldName} must be a valid date`),
      
  enum: (fieldName, allowedValues) =>
    body(fieldName)
      .isIn(allowedValues)
      .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`)
};

// File upload validation
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files || [req.file];
    
    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds ${maxSize} bytes`
        });
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        });
      }

      // Check for malicious file extensions
      const maliciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.js', '.jar'];
      const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (maliciousExtensions.includes(fileExtension)) {
        return res.status(400).json({
          success: false,
          message: 'File type not allowed for security reasons'
        });
      }
    }

    next();
  };
};

// Rate limiting for specific endpoints
const endpointRateLimit = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts per window
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // 10 uploads per hour
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window
  }
};

module.exports = {
  handleValidationErrors,
  validateAndSanitize,
  commonValidations,
  validateFileUpload,
  endpointRateLimit,
  sanitizeInput,
  deepSanitize
};
