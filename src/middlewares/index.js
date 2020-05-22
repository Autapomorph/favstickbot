const session = require('./session');
const updateUser = require('./updateUser');
const updateLocale = require('./updateLocale');
const isStickersBot = require('./isStickersBot');
const hasPackLink = require('./hasPackLink');
const i18n = require('./i18n');
const rateLimit = require('./rateLimit');
const logger = require('./logger');

module.exports = {
  session,
  updateUser,
  updateLocale,
  isStickersBot,
  hasPackLink,
  i18n,
  rateLimit,
  logger,
};
