const path = require('path');

require('dayjs/locale/en');
require('dayjs/locale/ru');

const locales = {
  en: {
    englishName: 'English',
    name: 'English',
    code: 'en',
    symbol: '🇺🇸',
  },
  ru: {
    englishName: 'Russian',
    name: 'Русский',
    code: 'ru',
    symbol: '🇷🇺',
  },
};

const defaultLocale = locales.en;

const resourcesPath = path.resolve(__dirname, '../../locales');

module.exports = {
  locales,
  defaultLocale,
  resourcesPath,
};
