const Markup = require('telegraf/markup');

const getCancelKeyboard = (ctx, extra = {}) => {
  const cancelBtn = ctx.i18n.t('shared.scene.leave.btn.cancel');

  return Markup.keyboard([[cancelBtn]])
    .resize()
    .extra(extra);
};

module.exports = getCancelKeyboard;
