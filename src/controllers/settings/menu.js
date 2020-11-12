const { MenuTemplate } = require('telegraf-inline-menu');

const { getMenuBody } = require('./helpers');
const langMenu = require('./language/menu');
const { setShowArchivedPacks } = require('./archivedPacks/actions');

const menu = new MenuTemplate(getMenuBody);

menu.toggle(ctx => ctx.i18n.t('menu.settings.actions.show_archived_packs'), 'archived_packs', {
  isSet: ctx => {
    const { user } = ctx.session;
    return user.settings.showArchivedPacks;
  },
  set: async (ctx, newState) => {
    await setShowArchivedPacks(ctx, newState);
    return true;
  },
});

menu.submenu(ctx => ctx.i18n.t('menu.settings.actions.language'), 'language', langMenu);

module.exports = menu;
