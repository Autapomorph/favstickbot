const { locales } = require('../../../config/i18n');

const getMenuBody = async ctx => {
  return ctx.i18n.t('menu.settings.language.body');
};

const getMenuChoices = async () => {
  return Object.values(locales).reduce((acc, { code, symbol, name }) => {
    acc[code] = `${symbol} ${name}`;
    return acc;
  }, {});
};

module.exports = {
  getMenuBody,
  getMenuChoices,
};
