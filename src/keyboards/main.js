const { Markup } = require('telegraf');

const getMainKeyboard = ctx => {
  const packListBtn = ctx.i18n.t('keyboard.main.packs');
  const newPackBtn = ctx.i18n.t('keyboard.main.new');
  const settingsBtn = ctx.i18n.t('keyboard.main.settings');
  return Markup.keyboard([[packListBtn], [newPackBtn], [settingsBtn]]).resize();
};

module.exports = getMainKeyboard;
