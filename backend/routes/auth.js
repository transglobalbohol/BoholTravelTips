const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');
const { protect, checkBruteForce } = require('../middleware/auth');
const { 
  commonValidations, 
  handleValidationErrors,
  validateAndSanitize 
} = require('../middleware/validation');
const { Logger } = require('../middleware/logging');

const router = express.Router();

// Enhanced rate limiting for different auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    // Create composite key with IP + email for more granular limiting
    return `${req.ip}:${req.body?.email || 'unknown'}`;
  },
  handler: (req, res) => {
    Logger.security('Rate limit exceeded for login', {
      ip: req.ip,
      email: req.body?.email,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      retryAfter: 15 * 60
    });
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour per IP
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour per IP
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again in an hour.'
  }
});

// Registration validation rules
const registerValidation = [
  commonValidations.name,
  commonValidations.email,
  commonValidations.password,
  commonValidations.phone.optional(),
  handleValidationErrors
];

// Login validation rules
const loginValidation = [
  commonValidations.email,
  commonValidations.text('password', 1, 255),
  handleValidationErrors
];

// Password change validation
const passwordChangeValidation = [
  commonValidations.text('currentPassword', 1, 255),
  commonValidations.password.withMessage('New password must meet security requirements'),
  handleValidationErrors
];

// Password reset validation
const passwordResetValidation = [
  commonValidations.email,
  handleValidationErrors
];

// Profile update validation
const profileUpdateValidation = [
  commonValidations.name.optional(),
  commonValidations.phone.optional(),
  commonValidations.url.optional().custom((value, { req }) => {
    if (value && req.body.profileImage) {
      if (!value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        throw new Error('Profile image must be a valid image URL');
      }
    }
    return true;
  }),
  handleValidationErrors
];

// Routes with security middleware

// Public routes (no authentication required)
router.post('/register', 
  registerLimiter,
  registerValidation,
  validateAndSanitize,
  checkBruteForce('register'),
  register
);

router.post('/login',
  loginLimiter,
  loginValidation,
  validateAndSanitize,
  checkBruteForce('login'),
  login
);

router.post('/password-reset-request',
  passwordResetLimiter,
  validateAndSanitize,
  passwordResetValidation,
  requestPasswordReset
);

router.post('/reset-password',
  passwordResetLimiter,
  validateAndSanitize,
  [
    commonValidations.text('token', 1, 255),
    commonValidations.password,
    handleValidationErrors
  ],
  resetPassword
);

router.get('/verify-email/:token',
  verifyEmail
);

// Protected routes (authentication required)
router.use(protect); // All routes below require authentication

router.post('/logout', logout);

router.get('/profile', getProfile);

router.put('/profile',
  validateAndSanitize,
  profileUpdateValidation,
  updateProfile
);

router.put('/change-password',
  validateAndSanitize,
  passwordChangeValidation,
  changePassword
);

// Admin-only routes
router.get('/users', 
  // authorize('admin'), // Uncomment when admin functionality is needed
  async (req, res) => {
    try {
      // Implementation for admin to list users
      res.json({
        success: true,
        message: 'Admin endpoint - not yet implemented'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Security monitoring routes
router.get('/sessions',
  async (req, res) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id).select('activeSessions');
      
      const sessions = user.activeSessions.map(session => ({
        id: session.sessionId,
        createdAt: session.createdAt,
        lastActive: session.lastActive,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isCurrent: session.sessionId === req.user.sessionId
      }));

      res.json({
        success: true,
        sessions
      });
    } catch (error) {
      Logger.error('Get sessions error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve sessions'
      });
    }
  }
);

router.delete('/sessions/:sessionId',
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const User = require('../models/User');
      
      const user = await User.findById(req.user.id);
      await user.removeSession(sessionId);

      Logger.security('Session terminated', {
        userId: req.user.id,
        terminatedSessionId: sessionId,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Session terminated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to terminate session'
      });
    }
  }
);

router.delete('/sessions',
  async (req, res) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      
      // Clear all sessions except current
      const currentSessionId = req.user.sessionId;
      user.activeSessions = user.activeSessions.filter(
        session => session.sessionId === currentSessionId
      );
      
      await user.save();

      Logger.security('All sessions terminated except current', {
        userId: req.user.id,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'All other sessions terminated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to terminate sessions'
      });
    }
  }
);

// Route for checking authentication status
router.get('/check',
  async (req, res) => {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      }
    });
  }
);

// Route for refreshing token
router.post('/refresh',
  async (req, res) => {
    try {
      const jwt = require('jsonwebtoken');
      const crypto = require('crypto');

      // Generate new session ID
      const newSessionId = crypto.randomUUID();
      
      // Create new token with same user data but new session
      const tokenPayload = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        sessionId: newSessionId,
        iat: Math.floor(Date.now() / 1000),
        iss: 'boholtraveltips.com',
        aud: 'boholtraveltips-app'
      };

      const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '24h'
      });

      // Update user's session
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      
      // Remove old session and add new one
      await user.removeSession(req.user.sessionId);
      await user.addSession(newSessionId, req.ip, req.get('User-Agent'));

      Logger.security('Token refreshed', {
        userId: req.user.id,
        oldSessionId: req.user.sessionId,
        newSessionId,
        ip: req.ip
      });

      res.json({
        success: true,
        token: newToken,
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      Logger.error('Token refresh error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        message: 'Failed to refresh token'
      });
    }
  }
);

module.exports = router;
