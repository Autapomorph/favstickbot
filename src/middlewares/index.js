const logUpdate = require('./logUpdate');
const setBotInfo = require('./setBotInfo');
const session = require('./session');
const updateUser = require('./updateUser');
const updateLocale = require('./updateLocale');
const isStickersBot = require('./isStickersBot');
const hasPackLink = require('./hasPackLink');
const isDocumentValid = require('./isDocumentValid');
const rateLimit = require('./rateLimit');
const i18n = require('./i18n');

module.exports = {
  logUpdate,
  setBotInfo,
  session,
  updateUser,
  updateLocale,
  isStickersBot,
  hasPackLink,
  isDocumentValid,
  rateLimit,
  i18n,
};
