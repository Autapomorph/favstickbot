const updateLogger = require('telegraf-update-logger');
const logger = require('../utils/logger');

module.exports = updateLogger({ colors: true, log: logger.debug });
