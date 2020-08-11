const getMainKeyboard = require('../../keyboards/main');

module.exports = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('cmd.unknown.reply'), getMainKeyboard(ctx).extra());
};
