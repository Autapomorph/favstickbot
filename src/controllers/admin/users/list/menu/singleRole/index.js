import { MenuTemplate } from 'telegraf-inline-menu';

import { getMenuBody, getMenuChoices, getTotalPages, getCurrentPage, setPage } from './helpers.js';
import { options } from './options.js';
import { menu as singleUserMenu } from '../singleUser/index.js';

export const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singleUserMenu, options);

menu.pagination('P', {
  getTotalPages,
  getCurrentPage,
  setPage,
});

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');
