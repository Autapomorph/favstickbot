const { Markup } = require('telegraf');

const getCancelKeyboard = ctx => {
  const cancelBtn = ctx.i18n.t('keyboard.shared.cancel');
  return Markup.keyboard([[cancelBtn]]).resize();
};

module.exports = getCancelKeyboard;
