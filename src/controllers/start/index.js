const getMainKeyboard = require('../../keyboards/main');
const getUserName = require('../../utils/users/getUserName');

module.exports = async ctx => {
  return ctx.replyWithHTML(
    ctx.i18n.t('cmd.start.reply', {
      name: getUserName(ctx.from),
    }),
    getMainKeyboard(ctx),
  );
};
