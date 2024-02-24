import { MenuTemplate } from 'telegraf-inline-menu';

import { menu as singlePackMenu } from './singlePack/index.js';
import { options } from './options.js';
import { getMenuBody, getMenuChoices, getTotalPages, getCurrentPage, setPage } from './helpers.js';

export const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singlePackMenu, options);

menu.pagination('', {
  getTotalPages,
  getCurrentPage,
  setPage,
});
