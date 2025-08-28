const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Enhanced Helmet Configuration with Additional Security Headers
const advancedHelmetConfig = helmet({
  // Content Security Policy - Enhanced for better security
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for some CSS frameworks
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:",
        "*.boholtraveltips.com"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Remove in production, use nonces instead
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'none'"],
      manifestSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://api.boholtraveltips.com",
        "wss://api.boholtraveltips.com"
      ]
    },
    reportingEndpoint: "/api/security/csp-report"
  },
  
  // Cross-Origin Policies - Enhanced
  crossOriginEmbedderPolicy: { policy: "credentialless" }, // More flexible than require-corp
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" }, // More restrictive than cross-origin
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // X-Frame-Options - Prevent clickjacking
  frameguard: { action: 'deny' },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security - Enhanced
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // X-Download-Options for IE8+
  ieNoOpen: true,
  
  // X-Content-Type-Options
  noSniff: true,
  
  // Origin-Agent-Cluster header
  originAgentCluster: true,
  
  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: false,
  
  // Referrer Policy - Enhanced privacy
  referrerPolicy: { 
    policy: ["no-referrer", "strict-origin-when-cross-origin"] 
  },
  
  // X-XSS-Protection
  xssFilter: true
});

// Additional Custom Security Headers
const customSecurityHeaders = (req, res, next) => {
  // Security headers for API responses
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-RateLimit-Policy', 'Standard');
  res.setHeader('X-Content-Security-Policy', 'default-src self');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Additional frame protection
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent information disclosure
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Cache control for sensitive endpoints
  if (req.path.includes('/auth/') || req.path.includes('/admin/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  next();
};

// Enhanced JWT Token Generation with Additional Claims
const generateSecureJWT = (user, sessionId, ipAddress, userAgent) => {
  const jwtPayload = {
    // Standard claims
    iss: 'boholtraveltips.com', // Issuer
    aud: 'boholtraveltips-app', // Audience
    sub: user._id.toString(), // Subject (user ID)
    iat: Math.floor(Date.now() / 1000), // Issued at
    nbf: Math.floor(Date.now() / 1000), // Not before
    
    // Custom claims for enhanced security
    id: user._id,
    email: user.email,
    role: user.role,
    sessionId,
    
    // Security context
    ipAddress: crypto.createHash('sha256').update(ipAddress).digest('hex'), // Hashed IP
    userAgent: crypto.createHash('sha256').update(userAgent || '').digest('hex'), // Hashed UA
    
    // Token metadata
    tokenType: 'access',
    version: '1.0',
    
    // Security flags
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled || false,
    
    // Additional security claims
    accountStatus: user.isActive ? 'active' : 'inactive',
    lastPasswordChange: user.passwordChangedAt ? Math.floor(user.passwordChangedAt.getTime() / 1000) : null
  };
  
  const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRE || '24h',
    algorithm: 'HS256', // Specify algorithm explicitly
    noTimestamp: false, // Include timestamp
    header: {
      typ: 'JWT',
      alg: 'HS256',
      kid: process.env.JWT_KEY_ID || 'default' // Key ID for key rotation
    }
  };
  
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
};

// Enhanced JWT Verification with Additional Security Checks
const verifySecureJWT = (token, ipAddress, userAgent) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Explicitly specify allowed algorithms
      audience: 'boholtraveltips-app',
      issuer: 'boholtraveltips.com',
      clockTolerance: 30 // Allow 30 seconds clock skew
    });
    
    // Additional security validations
    const now = Math.floor(Date.now() / 1000);
    
    // Check token age (additional to exp claim)
    const tokenAge = now - decoded.iat;
    const maxTokenAge = 24 * 60 * 60; // 24 hours in seconds
    
    if (tokenAge > maxTokenAge) {
      throw new Error('Token exceeded maximum age');
    }
    
    // Verify IP address if present (optional, can be disabled for mobile apps)
    if (decoded.ipAddress && process.env.VERIFY_IP_ADDRESS === 'true') {
      const currentIPHash = crypto.createHash('sha256').update(ipAddress).digest('hex');
      if (decoded.ipAddress !== currentIPHash) {
        throw new Error('Token IP address mismatch');
      }
    }
    
    // Verify user agent if present (optional, can cause issues with browser updates)
    if (decoded.userAgent && process.env.VERIFY_USER_AGENT === 'true') {
      const currentUAHash = crypto.createHash('sha256').update(userAgent || '').digest('hex');
      if (decoded.userAgent !== currentUAHash) {
        throw new Error('Token user agent mismatch');
      }
    }
    
    // Check if token version is supported
    if (decoded.version && decoded.version !== '1.0') {
      throw new Error('Unsupported token version');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Security Event Logger Enhancement
const logSecurityEvent = (eventType, details, severity = 'info') => {
  const securityEvent = {
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    details: {
      ...details,
      serverTime: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV
    }
  };
  
  // Log based on severity
  switch (severity) {
    case 'critical':
      console.error(`[SECURITY CRITICAL] ${eventType}:`, JSON.stringify(securityEvent, null, 2));
      break;
    case 'high':
      console.warn(`[SECURITY HIGH] ${eventType}:`, JSON.stringify(securityEvent, null, 2));
      break;
    case 'medium':
      console.log(`[SECURITY MEDIUM] ${eventType}:`, JSON.stringify(securityEvent, null, 2));
      break;
    default:
      console.log(`[SECURITY INFO] ${eventType}:`, JSON.stringify(securityEvent, null, 2));
  }
};

// Rate Limiting with Enhanced Configuration
const createAdvancedRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for whitelisted IPs in production
      const whitelistedIPs = process.env.WHITELISTED_IPS?.split(',') || [];
      return whitelistedIPs.includes(req.ip);
    },
    handler: (req, res) => {
      logSecurityEvent('rate_limit_exceeded', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent'),
        limit: options.max || 100
      }, 'medium');
      
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil(options.windowMs / 1000)
      });
    },
    keyGenerator: (req) => {
      // Enhanced key generation for better rate limiting
      const userKey = req.user?.id || 'anonymous';
      return `${req.ip}:${userKey}`;
    }
  };
  
  return { ...defaultOptions, ...options };
};

// Security Monitoring Middleware
const securityMonitoring = (req, res, next) => {
  // Monitor suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//g, // Directory traversal
    /<script/gi, // XSS attempts
    /union.*select/gi, // SQL injection
    /javascript:/gi, // JavaScript protocol
    /'.*or.*1.*=/gi // SQL injection patterns
  ];
  
  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  const suspiciousActivity = suspiciousPatterns.some(pattern => pattern.test(requestData));
  
  if (suspiciousActivity) {
    logSecurityEvent('suspicious_request_detected', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      requestData: req.body // Log for analysis
    }, 'high');
  }
  
  // Add security context to request
  req.securityContext = {
    requestId: crypto.randomUUID(),
    timestamp: Date.now(),
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    suspicious: suspiciousActivity
  };
  
  next();
};

module.exports = {
  advancedHelmetConfig,
  customSecurityHeaders,
  generateSecureJWT,
  verifySecureJWT,
  logSecurityEvent,
  createAdvancedRateLimit,
  securityMonitoring
};
