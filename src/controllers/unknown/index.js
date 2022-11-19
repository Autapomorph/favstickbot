const getMainKeyboard = require('../../keyboards/main');

module.exports = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('cmd.unknown.reply'), {
    ...getMainKeyboard(ctx),
    parse_mode: 'HTML',
  });
};
