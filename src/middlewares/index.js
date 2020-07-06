const botInfo = require('./botInfo');
const session = require('./session');
const updateUser = require('./updateUser');
const updateLocale = require('./updateLocale');
const isStickersBot = require('./isStickersBot');
const hasPackLink = require('./hasPackLink');
const i18n = require('./i18n');
const rateLimit = require('./rateLimit');
const logUpdate = require('./logUpdate');

module.exports = {
  botInfo,
  session,
  updateUser,
  updateLocale,
  isStickersBot,
  hasPackLink,
  i18n,
  rateLimit,
  logUpdate,
};
