import { locales } from '../../../config/i18n.js';

export const getMenuBody = async ctx => {
  return ctx.i18n.t('menu.settings.language.body');
};

export const getMenuChoices = async () => {
  return Object.values(locales).reduce((acc, { code, symbol, name }) => {
    acc[code] = `${symbol} ${name}`;
    return acc;
  }, {});
};
