const Markup = require('telegraf/markup');

const getPackTypeKeyboard = ctx => {
  const normalBtn = ctx.i18n.t('scenes.pack_create.btn.normal');
  const animatedBtn = ctx.i18n.t('scenes.pack_create.btn.animated');
  const cancelBtn = ctx.i18n.t('shared.scene.leave.btn.cancel');
  return Markup.keyboard([[normalBtn, animatedBtn], [cancelBtn]]).resize();
};

module.exports = getPackTypeKeyboard;
