const getMainKeyboard = require('../../keyboards/main');

module.exports = async ctx => {
  const { user } = ctx.session;
  await user.deleteOne();
  ctx.session = undefined;
  return ctx.replyWithHTML(ctx.i18n.t('cmd.deleteme.reply'), getMainKeyboard(ctx));
};
