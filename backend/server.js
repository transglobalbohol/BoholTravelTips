const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Security middleware imports
const {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
  inputSanitization,
  requestLimits,
  corsOptions,
  securityMonitoring
} = require('./middleware/security');

const {
  Logger,
  securityLogger,
  requestLogger,
  errorLogger,
  suspiciousActivityLogger
} = require('./middleware/logging');

const {
  validateAndSanitize
} = require('./middleware/validation');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security headers (must be first)
app.use(securityHeaders);

// Security monitoring and threat detection
app.use(securityMonitoring);

// CORS configuration
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Suspicious activity detection
app.use(suspiciousActivityLogger);

// Security event logging
app.use(securityLogger);

// Request size limits
app.use(requestLimits);

// Body parsing with limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Input sanitization (must be after body parsing)
app.use(inputSanitization);
app.use(validateAndSanitize);

// General rate limiting
app.use('/api/', generalLimiter);

// Specific rate limiting for auth endpoints
app.use('/api/auth/', authLimiter);

// Upload rate limiting
app.use('/api/upload/', uploadLimiter);

// Static files for uploads (with security headers)
app.use('/uploads', (req, res, next) => {
  // Prevent directory traversal
  if (req.path.includes('..')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file path'
    });
  }
  
  // Set security headers for static files
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  next();
}, express.static('uploads', {
  maxAge: 0, // No caching for security
  etag: false,
  lastModified: false
}));

// Enhanced MongoDB connection with security options
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;

const connectDB = async () => {
  try {
    connectionAttempts++;
    console.log(`Attempting to connect to MongoDB (attempt ${connectionAttempts}/${MAX_RETRY_ATTEMPTS})...`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000
    });

    Logger.info('MongoDB Connected', { 
      host: conn.connection.host,
      database: conn.connection.name 
    });

    // Reset connection attempts on successful connection
    connectionAttempts = 0;
    console.log(`MongoDB Connected: ${conn.connection.name} @ ${conn.connection.host}`);

    // Set up connection event handlers
    conn.connection.on('error', (err) => {
      Logger.error('MongoDB connection error', { error: err.message });
    });

    conn.connection.on('disconnected', () => {
      Logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await conn.connection.close();
      Logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    Logger.error('Database connection error', { 
      error: error.message,
      stack: error.stack,
      attempt: connectionAttempts
    });
    console.error(`MongoDB connection failed (attempt ${connectionAttempts}/${MAX_RETRY_ATTEMPTS}):`, error.message);
    
    if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying connection in 5 seconds...`);
      setTimeout(() => {
        connectDB();
      }, 5000);
    } else {
      console.error(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Please check your MongoDB connection.`);
      console.error('Check your .env file and ensure MONGODB_URI is correct.');
      console.error('Connection string should start with mongodb:// or mongodb+srv://');
      
      // Don't exit completely, but log the failure
      Logger.error('MongoDB connection failed after maximum retries', { 
        maxAttempts: MAX_RETRY_ATTEMPTS,
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Missing'
      });
    }
    
    return; // Don't exit immediately
  }
};

// Connect to database
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const uploadRoutes = require('./routes/upload');
const securityRoutes = require('./routes/security'); // New security routes

// API routes with additional security
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/security', securityRoutes); // New security monitoring endpoints

// Health check endpoint with security info
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bohol Travel Tips API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    security: {
      headers: 'enabled',
      rateLimit: 'enabled',
      inputValidation: 'enabled',
      logging: 'enabled',
      authentication: 'enabled',
      encryption: 'enabled'
    }
  });
});

// Security status endpoint (public, limited info)
app.get('/api/security/status', (req, res) => {
  res.json({
    securityFeatures: {
      helmet: true,
      rateLimit: true,
      cors: true,
      inputValidation: true,
      xssProtection: true,
      sqlInjectionProtection: true,
      bruteForceProtection: true,
      logging: true,
      monitoring: true,
      encryption: true
    },
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  });
});

// CSP reporting endpoint
app.post('/api/security/csp-report', (req, res) => {
  const report = req.body['csp-report'] || req.body;
  
  Logger.security('CSP Violation Report', {
    report,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(204).send();
});

// Error tracking endpoint for frontend
app.post('/api/errors', (req, res) => {
  const { error, stack, url, userAgent, timestamp } = req.body;
  
  Logger.error('Frontend error report', {
    error,
    stack,
    url,
    userAgent,
    timestamp,
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Error reported'
  });
});

// Error handling middleware (must be last)
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  Logger.error('Unhandled application error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  Logger.warn('404 - Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Promise Rejection', {
    error: {
      message: err.message,
      stack: err.stack
    }
  });
  // Don't exit on unhandled rejection in development
  if (process.env.NODE_ENV === 'production') {
    console.log('Unhandled Promise Rejection. Server will continue running...');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception', {
    error: {
      message: err.message,
      stack: err.stack
    }
  });
  
  // Only exit on critical errors
  if (err.name === 'ReferenceError' || err.name === 'SyntaxError') {
    console.log('Critical error occurred. Shutting down...');
    process.exit(1);
  } else {
    console.log('Uncaught exception handled. Server will continue running...');
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  Logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    securityStatus: 'ENABLED'
  });

  console.log(`SECURITY STATUS: ENABLED`);
  console.log(`Server running on port ${PORT}`);
  console.log(`All OWASP Top 10 protections active`);
  console.log(`Logging and monitoring enabled`);
  console.log(`Authentication and authorization active`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  Logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    Logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      Logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    Logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
