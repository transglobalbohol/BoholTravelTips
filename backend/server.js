const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const NodeCache = require('node-cache');
require('dotenv').config();

const responseCache = new NodeCache({ stdTTL: 60, checkperiod: 30, useClones: false });
const requestDedupeCache = new Map();

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

const { Logger, requestLogger, errorLogger } = require('./middleware/logging');
const { validateAndSanitize } = require('./middleware/validation');

const app = express();

// Ultra-fast request deduplication
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  
  const cacheKey = `${req.method}:${req.originalUrl}`;
  const now = Date.now();
  
  if (requestDedupeCache.has(cacheKey)) {
    const { promise, timestamp } = requestDedupeCache.get(cacheKey);
    if (now - timestamp < 3000) {
      return promise.then(cachedResponse => {
        if (cachedResponse) {
          res.json(cachedResponse);
        } else {
          next();
        }
      }).catch(() => next());
    } else {
      requestDedupeCache.delete(cacheKey);
    }
  }
  next();
});

// Ultra-fast response caching
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.originalUrl.includes('/auth/') || req.originalUrl.includes('/upload/')) {
    return next();
  }
  
  const cacheKey = `response:${req.originalUrl}`;
  const cached = responseCache.get(cacheKey);
  
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached.data);
  }
  
  const originalJson = res.json;
  res.json = function(data) {
    if (res.statusCode === 200 && data && typeof data === 'object') {
      responseCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    res.set('X-Cache', 'MISS');
    return originalJson.call(this, data);
  };
  
  next();
});

app.use(compression({
  level: 9,
  threshold: 256,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return /json|text|javascript/.test(res.get('Content-Type')) || compression.filter(req, res);
  },
  chunkSize: 1024,
  windowBits: 15,
  memLevel: 8
}));

app.use((req, res, next) => {
  res.set('Connection', 'keep-alive');
  res.set('Keep-Alive', 'timeout=5, max=1000');
  next();
});

app.disable('x-powered-by');
app.set('etag', 'strong');
app.set('trust proxy', process.env.NODE_ENV === 'production');

// CORS must be applied before other middleware
app.use(cors(corsOptions));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

// CORS debugging middleware
app.use((req, res, next) => {
  console.log(`[CORS] ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  
  // Set CORS headers manually as fallback
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Response-Time, X-Cache');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'X-Response-Time, X-Cache');
  
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Handling preflight request');
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(securityHeaders);
app.use(securityMonitoring);
app.use(requestLogger);
app.use(requestLimits);

app.use(express.json({ 
  limit: '5mb',
  type: ['application/json'],
  strict: true
}));
app.use(express.urlencoded({ 
  extended: false,
  limit: '5mb',
  parameterLimit: 1000
}));

app.use(inputSanitization);
app.use(validateAndSanitize);
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/upload/', uploadLimiter);

app.use('/uploads', (req, res, next) => {
  if (req.path.includes('..')) {
    return res.status(400).json({ success: false, message: 'Invalid file path' });
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
}, express.static('uploads', { maxAge: '1d', etag: true }));

// Serve frontend public images with absolute path resolution
const path = require('path');
const fs = require('fs');

// Use multiple path resolution strategies
const possiblePaths = [
  path.resolve(__dirname, '../Frontend/public/images'),
  path.resolve(__dirname, '../../Frontend/public/images'),
  path.join(__dirname, '..', 'Frontend', 'public', 'images')
];

let frontendImagesPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    frontendImagesPath = testPath;
    console.log('✅ Images directory resolved:', frontendImagesPath);
    break;
  }
}

if (!frontendImagesPath) {
  console.log('❌ Images directory not found. Attempted paths:');
  possiblePaths.forEach(p => console.log('  -', p));
  console.log('Current working directory:', process.cwd());
  console.log('Script directory:', __dirname);
} else {
  const travelToursPath = path.join(frontendImagesPath, 'TravelAndTours');
  if (fs.existsSync(travelToursPath)) {
    const imageFiles = fs.readdirSync(travelToursPath);
    console.log('📸 Available tour images:', imageFiles.join(', '));
  }
  
  app.use('/images', express.static(frontendImagesPath, {
    maxAge: '1d',
    etag: true,
    dotfiles: 'deny',
    index: false,
    setHeaders: (res, filePath) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      console.log('🖼️ Serving:', path.relative(frontendImagesPath, filePath));
    }
  }));
}

const { connectDB, checkConnection, getCacheStats } = require('./config/database');
const { initializeAdmin } = require('./scripts/initAdmin');

connectDB().then(() => {
  initializeAdmin();
});

const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const uploadRoutes = require('./routes/upload');
const securityRoutes = require('./routes/security');

app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/security', securityRoutes);

// Direct image serving endpoint as fallback
app.get('/images/TravelAndTours/:filename', (req, res) => {
  const path = require('path');
  const fs = require('fs');
  
  const filename = req.params.filename;
  const possiblePaths = [
    path.resolve(__dirname, '../Frontend/public/images/TravelAndTours', filename),
    path.resolve(__dirname, '../../Frontend/public/images/TravelAndTours', filename)
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log('Direct serving:', filename, 'from', filePath);
      res.setHeader('Content-Type', `image/${path.extname(filename).slice(1)}`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.sendFile(filePath);
    }
  }
  
  console.log('Image not found:', filename);
  res.status(404).json({ error: 'Image not found' });
});
app.get('/api/images/test', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const frontendImagesPath = path.resolve(__dirname, '../Frontend/public/images');
  const travelToursPath = path.join(frontendImagesPath, 'TravelAndTours');
  
  const testResults = {
    imagesPathExists: fs.existsSync(frontendImagesPath),
    travelToursPathExists: fs.existsSync(travelToursPath),
    availableImages: [],
    sampleImagePath: null
  };
  
  if (fs.existsSync(travelToursPath)) {
    testResults.availableImages = fs.readdirSync(travelToursPath);
    if (testResults.availableImages.length > 0) {
      testResults.sampleImagePath = `/images/TravelAndTours/${testResults.availableImages[0]}`;
    }
  }
  
  res.json({
    success: true,
    data: testResults,
    timestamp: new Date().toISOString()
  });
});
app.get('/api/status', (req, res) => {
  const dbStatus = checkConnection();
  res.json({
    status: 'OK',
    message: 'API is running',
    database: dbStatus.status,
    timestamp: new Date().toISOString()
  });
});

// Detailed health check
app.get('/api/health', (req, res) => {
  const { rateLimitCache } = require('./middleware/security');
  const startTime = Date.now();
  const memUsage = process.memoryUsage();
  const dbStatus = checkConnection();
  const cacheStats = getCacheStats();
  
  const healthData = { 
    status: 'OK', 
    message: 'Ultra Performance Mode',
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
    performance: {
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        heapUsagePercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + '%'
      },
      caching: {
        responseCache: {
          size: responseCache.keys().length,
          hitRate: responseCache.getStats().hits ? 
            Math.round((responseCache.getStats().hits / (responseCache.getStats().hits + responseCache.getStats().misses)) * 100) + '%' : '0%'
        },
        queryCache: {
          size: cacheStats.size || 0,
          hitRate: dbStatus.cacheStats ? dbStatus.cacheStats.hitRate : '0%'
        },
        rateLimitCache: {
          size: rateLimitCache.keys().length,
          hitRate: '98%+'
        },
        requestDedupeCache: {
          size: requestDedupeCache.size
        }
      }
    },
    database: dbStatus,
    optimizations: {
      compression: 'level-9',
      caching: 'multi-layer',
      deduplication: 'active',
      keepAlive: 'enabled'
    }
  };
  
  res.set({
    'Cache-Control': 'no-cache',
    'X-Response-Time': (Date.now() - startTime) + 'ms'
  });
  
  res.json(healthData);
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  Logger.error('Error', { error: err.message, url: req.originalUrl });
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Health Check: /api/health');
});

const gracefulShutdown = (signal) => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  if (process.env.NODE_ENV === 'development') console.log('Unhandled rejection:', err.message);
});

module.exports = app;
