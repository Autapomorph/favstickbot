const I18n = require('telegraf-i18n');

const { resourcesPath, defaultLocale } = require('../config');

const i18n = new I18n({
  directory: resourcesPath,
  defaultLanguage: defaultLocale.code,
});

module.exports = i18n.middleware();
