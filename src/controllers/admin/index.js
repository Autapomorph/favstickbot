import { replyMenuToContext } from 'telegraf-inline-menu';

import { menu } from './menu/index.js';
import { users } from './users/index.js';
import { stats } from './stats/index.js';

const menuController = async ctx => {
  return replyMenuToContext(menu, ctx, 'admin/');
};

export const admin = {
  menu: menuController,
  users,
  stats,
};
