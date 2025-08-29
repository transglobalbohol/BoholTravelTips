const mongoose = require('mongoose');
const NodeCache = require('node-cache');

const queryCache = new NodeCache({ 
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 25,
      minPoolSize: 8,
      maxIdleTimeMS: 25000,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 8000,
      maxConnecting: 4,
      heartbeatFrequencyMS: 10000,
      writeConcern: { w: 1, j: false }
    });

    conn.connection.on('error', (err) => console.error('❌ DB Error:', err));
    
    mongoose.set('strictQuery', true);
    if (process.env.NODE_ENV === 'production') mongoose.set('autoIndex', false);
    mongoose.set('bufferCommands', false);
    
    mongoose.plugin((schema) => {
      schema.index({ createdAt: -1 });
      schema.pre(/^find/, function() {
        if (!this.getOptions().populate) this.lean();
      });
    });

    await conn.connection.db.admin().ping();
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    return conn;
    
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    process.exit(1);
  }
};

const checkConnection = () => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const stats = queryCache.getStats();
  
  return {
    status: states[state] || 'unknown',
    host: mongoose.connection.host || 'not-connected',
    cacheStats: {
      keys: queryCache.keys().length,
      hits: stats.hits || 0,
      misses: stats.misses || 0,
      hitRate: stats.hits && stats.misses ? 
        Math.round((stats.hits / (stats.hits + stats.misses)) * 100) + '%' : '0%'
    }
  };
};

const getCacheStats = () => ({
  size: queryCache.keys().length,
  stats: queryCache.getStats()
});

const clearQueryCache = (pattern) => {
  if (pattern) {
    const keys = queryCache.keys().filter(key => key.includes(pattern));
    keys.forEach(key => queryCache.del(key));
    return keys.length;
  } else {
    const keyCount = queryCache.keys().length;
    queryCache.flushAll();
    return keyCount;
  }
};

module.exports = { connectDB, checkConnection, queryCache, clearQueryCache, getCacheStats };
