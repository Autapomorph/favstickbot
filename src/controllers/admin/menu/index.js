import { MenuTemplate } from 'telegraf-inline-menu';

import { getMenuBody } from './helpers.js';
import { menu as statsMenu } from '../stats/menu/index.js';
import { menu as usersMenu } from '../users/list/menu/index.js';

export const menu = new MenuTemplate(getMenuBody);

menu.submenu(
  ctx => (ctx.state.ability.can('read', 'User') ? ctx.i18n.t('menu.admin.actions.users') : ''),
  'u',
  usersMenu,
);

menu.submenu(
  ctx => (ctx.state.ability.can('read', 'Stats') ? ctx.i18n.t('menu.admin.actions.stats') : ''),
  'stats',
  statsMenu,
);
