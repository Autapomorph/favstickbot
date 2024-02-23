import { replyMenuToContext } from 'telegraf-inline-menu';

import menu from './menu.js';

export const deleteMe = async ctx => {
  return replyMenuToContext(menu, ctx, 'deleteMe/');
};
