import { MenuTemplate } from 'telegraf-inline-menu';

import { getMenuBody } from './helpers.js';
import { menu as langMenu } from './language/menu.js';
import { setShowArchivedPacks } from './archivedPacks/actions.js';

export const menu = new MenuTemplate(getMenuBody);

menu.toggle(ctx => ctx.i18n.t('menu.settings.actions.show_archived_packs'), 'archived_packs', {
  isSet: ctx => {
    const { user } = ctx.state;
    return user.settings.showArchivedPacks;
  },
  set: async (ctx, newState) => {
    await setShowArchivedPacks(ctx, newState);
    return true;
  },
});

menu.submenu(ctx => ctx.i18n.t('menu.settings.actions.language'), 'language', langMenu);
