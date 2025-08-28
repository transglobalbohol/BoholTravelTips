const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { verifySecureJWT, logSecurityEvent } = require('./advancedSecurity');

// In-memory token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

// Enhanced JWT verification with additional security checks
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    try {
      // Enhanced JWT verification with additional security checks
      const decoded = verifySecureJWT(token, req.ip, req.get('User-Agent'));
      
      // Check token age (additional security layer)
      const tokenAge = Date.now() - decoded.iat * 1000;
      const maxTokenAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge > maxTokenAge) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      // Get user and check if exists and is active
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Check if user changed password after token was issued
      if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Password changed recently, please login again'
        });
      }

      // Check if session is still active (if sessionId exists in token)
      if (decoded.sessionId) {
        const sessionExists = user.activeSessions.some(
          session => session.sessionId === decoded.sessionId
        );
        
        if (!sessionExists) {
          return res.status(401).json({
            success: false,
            message: 'Session has been terminated'
          });
        }
      }

      // Add security headers
      res.setHeader('X-User-Role', user.role);
      res.setHeader('X-Auth-Status', 'authenticated');

      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Enhanced role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login.'
      });
    }

    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized access attempt by user ${req.user.id} to ${req.originalUrl}`);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient privileges.'
      });
    }

    next();
  };
};

// Resource-based authorization
const authorizeResource = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Allow admin access
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource
      const userField = resource.user || resource.userId || resource.createdBy;
      if (userField && userField.toString() === req.user.id.toString()) {
        req.resource = resource;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    } catch (error) {
      console.error('Resource authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

// Token blacklisting for logout
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // Clean up expired tokens periodically (basic implementation)
  if (tokenBlacklist.size > 10000) {
    tokenBlacklist.clear();
  }
};

// Brute force protection
const bruteForceProtection = new Map();

const checkBruteForce = (identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip + ':' + identifier;
    const now = Date.now();
    
    if (!bruteForceProtection.has(key)) {
      bruteForceProtection.set(key, { attempts: 0, resetTime: now + windowMs });
    }
    
    const record = bruteForceProtection.get(key);
    
    if (now > record.resetTime) {
      record.attempts = 0;
      record.resetTime = now + windowMs;
    }
    
    if (record.attempts >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.'
      });
    }
    
    req.bruteForceRecord = record;
    next();
  };
};

// Password strength validation
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Check for common weak passwords
  const weakPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty',
    'abc123', 'password1', 'admin', 'user', 'guest', 'weak'
  ];
  
  const errors = [];
  
  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common and easily guessable');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  protect,
  authorize,
  authorizeResource,
  blacklistToken,
  checkBruteForce,
  validatePasswordStrength
};
