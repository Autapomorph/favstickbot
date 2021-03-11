const { deleteMenuFromContext } = require('telegraf-inline-menu');

const getMainKeyboard = require('../../keyboards/main');

const eraseUserData = async ctx => {
  const { user } = ctx.state;
  await user.deleteOne();
  ctx.session = undefined;
  await ctx.replyWithHTML(ctx.i18n.t('operation.deleteme.reply.ok'), { ...getMainKeyboard(ctx) });
  await deleteMenuFromContext(ctx);
};

const cancel = async ctx => {
  return deleteMenuFromContext(ctx);
};

module.exports = {
  eraseUserData,
  cancel,
};
