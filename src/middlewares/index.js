const logUpdate = require('./logUpdate');
const setBotInfo = require('./setBotInfo');
const session = require('./session');
const getUser = require('./getUser');
const setLocale = require('./setLocale');
const isStickersBot = require('./isStickersBot');
const hasPackLink = require('./hasPackLink');
const validateDocument = require('./validateDocument');
const rateLimit = require('./rateLimit');
const i18n = require('./i18n');

module.exports = {
  logUpdate,
  setBotInfo,
  session,
  getUser,
  setLocale,
  isStickersBot,
  hasPackLink,
  validateDocument,
  rateLimit,
  i18n,
};
