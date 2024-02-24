import { replyMenuToContext } from 'telegraf-inline-menu';

import { menu } from './menu.js';

export const settings = async ctx => {
  return replyMenuToContext(menu, ctx, 'settings/');
};
