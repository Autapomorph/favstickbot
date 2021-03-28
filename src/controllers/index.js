const start = require('./start');
const admin = require('./admin');
const packs = require('./packs');
const stickers = require('./stickers');
const settings = require('./settings');
const deleteMe = require('./deleteMe');
const feedback = require('./feedback');
const botStatusChange = require('./botStatusChange');
const unknown = require('./unknown');

module.exports = {
  start,
  admin,
  packs,
  stickers,
  settings,
  deleteMe,
  feedback,
  botStatusChange,
  unknown,
};
