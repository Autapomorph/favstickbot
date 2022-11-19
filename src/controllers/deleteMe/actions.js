const { deleteMenuFromContext } = require('telegraf-inline-menu');

const getMainKeyboard = require('../../keyboards/main');

const eraseUserData = async ctx => {
  const { user } = ctx.state;
  await user.deleteOne();
  ctx.session = undefined;
  await ctx.sendMessage(ctx.i18n.t('operation.user.delete_me.reply.ok'), {
    ...getMainKeyboard(ctx),
    parse_mode: 'HTML',
  });
  await deleteMenuFromContext(ctx);
};

const cancel = async ctx => {
  return deleteMenuFromContext(ctx);
};

module.exports = {
  eraseUserData,
  cancel,
};
