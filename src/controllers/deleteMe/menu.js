import { MenuTemplate } from 'telegraf-inline-menu';

import * as actions from './actions.js';
import { getMenuBody } from './helpers.js';

export const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.delete_me.actions.yes'), 'y', {
  do: async ctx => {
    await actions.eraseUserData(ctx);
    return false;
  },
});

menu.interact(ctx => ctx.i18n.t('menu.delete_me.actions.no'), 'n', {
  do: async ctx => {
    await actions.cancel(ctx);
    return false;
  },
});
