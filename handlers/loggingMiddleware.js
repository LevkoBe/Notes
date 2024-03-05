const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const loggingMiddleware = (req, res, next) => {
  res.on('finish', () => {
    const { method, originalUrl } = req;
    const { statusCode, statusMessage } = res;

    if (statusCode >= 400) {
      logger.error(`${method} ${originalUrl} - ${statusCode} ${statusMessage}`);
    } else {
      logger.info(`${method} ${originalUrl} - ${statusCode} ${statusMessage}`);
    }
  });

  next();
};

module.exports = loggingMiddleware;
