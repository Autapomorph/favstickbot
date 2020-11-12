const { locales } = require('../../../config');

const getMenuBody = async () => {
  return Object.values(locales)
    .map(locale => locale.selectTextWithSymbol)
    .join('\n');
};

const getMenuChoices = async () => {
  return Object.values(locales).reduce((acc, locale) => {
    acc[locale.code] = locale.symbol;
    return acc;
  }, {});
};

module.exports = {
  getMenuBody,
  getMenuChoices,
};
