const webhook = require('./webhook');
const i18n = require('./i18n');
const packs = require('./packs');
const stickers = require('./stickers');

module.exports = {
  ...webhook,
  ...i18n,
  ...packs,
  ...stickers,
};
