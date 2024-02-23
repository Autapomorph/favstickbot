import { replyMenuToContext } from 'telegraf-inline-menu';

import { menu } from './menu/index.js';

export const list = async ctx => {
  return replyMenuToContext(menu, ctx, 'packs/');
};
