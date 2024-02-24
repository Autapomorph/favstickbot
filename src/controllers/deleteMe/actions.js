import { deleteMenuFromContext } from 'telegraf-inline-menu';

import { getMainKeyboard } from '../../keyboards/main.js';

export const eraseUserData = async ctx => {
  const { user } = ctx.state;
  await user.deleteOne();
  ctx.session = undefined;
  await ctx.sendMessage(ctx.i18n.t('operation.user.delete_me.reply.ok'), {
    ...getMainKeyboard(ctx),
    parse_mode: 'HTML',
  });
  await deleteMenuFromContext(ctx);
};

export const cancel = async ctx => {
  return deleteMenuFromContext(ctx);
};
