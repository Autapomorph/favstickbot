import { MenuTemplate } from 'telegraf-inline-menu';

import { menu as singleRoleMenu } from './singleRole/index.js';
import { getMenuBody, getMenuChoices } from './helpers.js';
import { options } from './options.js';

export const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singleRoleMenu, options);

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');
