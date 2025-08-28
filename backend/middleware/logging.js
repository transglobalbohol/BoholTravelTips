const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SECURITY: 'SECURITY'
};

// Create log entry
const createLogEntry = (level, message, meta = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
    pid: process.pid
  };
};

// Write log to file
const writeToFile = (filename, logEntry) => {
  const logPath = path.join(logsDir, filename);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logPath, logLine, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Logger class
class Logger {
  static log(level, message, meta = {}) {
    const logEntry = createLogEntry(level, message, meta);
    
    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, meta);
    }
    
    // File output for all environments
    const date = new Date().toISOString().split('T')[0];
    writeToFile(`${date}.log`, logEntry);
    
    // Separate security log
    if (level === LOG_LEVELS.SECURITY) {
      writeToFile(`security-${date}.log`, logEntry);
    }
    
    // Error log
    if (level === LOG_LEVELS.ERROR) {
      writeToFile(`error-${date}.log`, logEntry);
    }
  }

  static error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  static warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  static info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  static debug(message, meta = {}) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }

  static security(message, meta = {}) {
    this.log(LOG_LEVELS.SECURITY, message, meta);
  }
}

// Security event logging middleware
const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log security-relevant events
  const securityEvents = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/change-password'
  ];

  // Capture response for security events
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - startTime;
    
    if (securityEvents.some(event => req.path.includes(event))) {
      const logData = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
        body: res.statusCode >= 400 ? JSON.parse(body) : undefined
      };

      if (res.statusCode >= 400) {
        Logger.security(`Security event failed: ${req.method} ${req.path}`, logData);
      } else {
        Logger.security(`Security event success: ${req.method} ${req.path}`, logData);
      }
    }
    
    return originalSend.call(this, body);
  };

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log all API requests
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime,
      userId: req.user?.id,
      contentLength: res.get('Content-Length')
    };

    if (res.statusCode >= 500) {
      Logger.error(`Server error: ${req.method} ${req.path}`, logData);
    } else if (res.statusCode >= 400) {
      Logger.warn(`Client error: ${req.method} ${req.path}`, logData);
    } else {
      Logger.info(`Request: ${req.method} ${req.path}`, logData);
    }
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const logData = {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      headers: req.headers
    }
  };

  Logger.error('Application error', logData);
  
  next(err);
};

// Suspicious activity detection
const suspiciousActivityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection attempts
    /javascript:/i,  // JavaScript protocol
    /%3Cscript/i  // Encoded XSS
  ];

  const checkSuspicious = (str) => {
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  let suspicious = false;

  // Check URL
  if (checkSuspicious(req.url)) {
    suspicious = true;
  }

  // Check query parameters
  Object.values(req.query || {}).forEach(value => {
    if (typeof value === 'string' && checkSuspicious(value)) {
      suspicious = true;
    }
  });

  // Check request body
  if (req.body && typeof req.body === 'object') {
    JSON.stringify(req.body).split('').forEach(char => {
      if (checkSuspicious(char)) {
        suspicious = true;
      }
    });
  }

  if (suspicious) {
    Logger.security('Suspicious activity detected', {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      headers: req.headers,
      query: req.query,
      body: req.body,
      userId: req.user?.id
    });
  }

  next();
};

// Database operation logging
const dbLogger = {
  logQuery: (model, operation, query, result) => {
    Logger.debug(`Database ${operation}`, {
      model,
      operation,
      query: JSON.stringify(query),
      resultCount: Array.isArray(result) ? result.length : result ? 1 : 0,
      timestamp: new Date().toISOString()
    });
  },

  logError: (model, operation, query, error) => {
    Logger.error(`Database ${operation} error`, {
      model,
      operation,
      query: JSON.stringify(query),
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }
};

module.exports = {
  Logger,
  securityLogger,
  requestLogger,
  errorLogger,
  suspiciousActivityLogger,
  dbLogger
};
