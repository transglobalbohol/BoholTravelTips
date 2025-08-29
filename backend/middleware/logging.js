const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    }
  });
  next();
};

const errorLogger = (err, req, res, next) => {
  if (err.status >= 500) {
    console.error('Server Error:', err.message, req.originalUrl);
  }
  next(err);
};

const Logger = {
  info: (message, data) => {
    if (process.env.NODE_ENV === 'development') console.log(message, data);
  },
  error: (message, data) => {
    console.error(message, data?.error || data);
  },
  warn: (message, data) => {
    if (process.env.NODE_ENV === 'development') console.warn(message, data);
  }
};

module.exports = { requestLogger, errorLogger, Logger };
