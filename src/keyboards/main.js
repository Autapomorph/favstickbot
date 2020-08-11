const Markup = require('telegraf/markup');

const getMainKeyboard = ctx => {
  const packListBtn = ctx.i18n.t('cmd.start.btn.packs');
  const newPackBtn = ctx.i18n.t('cmd.start.btn.new');
  return Markup.keyboard([[packListBtn], [newPackBtn]]).resize();
};

module.exports = getMainKeyboard;
