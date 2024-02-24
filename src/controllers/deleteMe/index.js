import { replyMenuToContext } from 'telegraf-inline-menu';

import { menu as deleteMeMenu } from './menu.js';

export const deleteMe = async ctx => {
  return replyMenuToContext(deleteMeMenu, ctx, 'deleteMe/');
};
