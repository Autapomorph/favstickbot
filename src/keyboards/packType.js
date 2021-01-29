const { Markup } = require('telegraf');

const getPackTypeKeyboard = ctx => {
  const staticBtn = ctx.i18n.t('keyboard.pack_type.static');
  const animatedBtn = ctx.i18n.t('keyboard.pack_type.animated');
  const cancelBtn = ctx.i18n.t('keyboard.shared.cancel');
  return Markup.keyboard([[staticBtn, animatedBtn], [cancelBtn]]).resize();
};

module.exports = getPackTypeKeyboard;
