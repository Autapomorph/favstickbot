const path = require('path');

require('dayjs/locale/en');
require('dayjs/locale/ru');

const locales = {
  en: {
    name: 'english',
    localName: 'english',
    code: 'en',
    symbol: '🇺🇸',
    selectText: 'Select language',
    selectTextWithSymbol: '🇺🇸 Select language',
  },
  ru: {
    name: 'russian',
    localName: 'русский',
    code: 'ru',
    symbol: '🇷🇺',
    selectText: 'Выберите язык',
    selectTextWithSymbol: '🇷🇺 Выберите язык',
  },
};

const defaultLocale = locales.en;

const resourcesPath = path.resolve(__dirname, '../locales');

module.exports = {
  locales,
  defaultLocale,
  resourcesPath,
};
