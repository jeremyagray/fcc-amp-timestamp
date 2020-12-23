'use strict';

const winston = require('winston');

// Default logger for app.
const logger = winston.createLogger({
  'level': 'silly',
  'format': winston.format.combine(
    winston.format.uncolorize(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  'transports': [
    new winston.transports.Console()
  ]
});

// Export logger for use elsewhere.
module.exports = logger;
