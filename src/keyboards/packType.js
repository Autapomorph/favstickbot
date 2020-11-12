const Markup = require('telegraf/markup');

const getPackTypeKeyboard = ctx => {
  const normalBtn = ctx.i18n.t('keyboard.pack_type.normal');
  const animatedBtn = ctx.i18n.t('keyboard.pack_type.animated');
  const cancelBtn = ctx.i18n.t('keyboard.shared.cancel');
  return Markup.keyboard([[normalBtn, animatedBtn], [cancelBtn]]).resize();
};

module.exports = getPackTypeKeyboard;
