import { MenuTemplate } from 'telegraf-inline-menu';

import { setLanguage } from './actions.js';
import { getMenuBody, getMenuChoices } from './helpers.js';

export const menu = new MenuTemplate(getMenuBody);

menu.choose('set', getMenuChoices, {
  do: async ctx => {
    await setLanguage(ctx);
    return true;
  },
  columns: 5,
});

menu.navigate(ctx => ctx.i18n.t('menu.settings.language.actions.back'), '..');
