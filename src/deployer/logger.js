const winston = require('winston');
const config = require('./config');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      prettyPrint: true,
      depth: 5,
      stderrLevels: [], // Log everything to std out
      level: config.logger.level,
      formatter(options) {
        return `[${options.level.toUpperCase()}]: ${options.message}`;
      }
    })
  ],

  exitOnError: false
});

module.exports = logger;
