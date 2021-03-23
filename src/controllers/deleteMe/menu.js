const { MenuTemplate } = require('telegraf-inline-menu');

const actions = require('./actions');
const { getMenuBody } = require('./helpers');

const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.delete_me.actions.yes'), 'yes', {
  do: async ctx => {
    await actions.eraseUserData(ctx);
    return false;
  },
});

menu.interact(ctx => ctx.i18n.t('menu.delete_me.actions.no'), 'no', {
  do: async ctx => {
    await actions.cancel(ctx);
    return false;
  },
});

module.exports = menu;
