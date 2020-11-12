const { MenuTemplate } = require('telegraf-inline-menu');

const actions = require('./actions');
const { getMenuBody, getMenuChoices } = require('./helpers');

const menu = new MenuTemplate(getMenuBody);

menu.choose('set', getMenuChoices, {
  do: async ctx => {
    await actions.setLanguage(ctx);
    return true;
  },
  columns: 5,
});

menu.navigate(ctx => ctx.i18n.t('menu.settings.language.actions.back'), '..');

module.exports = menu;
