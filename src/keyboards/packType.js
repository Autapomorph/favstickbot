const Markup = require('telegraf/markup');

const getPackTypeKeyboard = (ctx, extra = {}) => {
  const staticBtn = ctx.i18n.t('scenes.pack_create.btn.static');
  const animBtn = ctx.i18n.t('scenes.pack_create.btn.anim');
  const cancelBtn = ctx.i18n.t('shared.scene.leave.btn.cancel');

  return Markup.keyboard([[staticBtn, animBtn], [cancelBtn]])
    .resize()
    .extra(extra);
};

module.exports = getPackTypeKeyboard;
