import { Markup } from 'telegraf';

export const getMainKeyboard = ctx => {
  const packListBtn = ctx.i18n.t('keyboard.main.packs');
  const newPackBtn = ctx.i18n.t('keyboard.main.new');
  const settingsBtn = ctx.i18n.t('keyboard.main.settings');
  const adminBtn = {
    text: ctx.i18n.t('keyboard.main.admin'),
    hide: ctx.state.ability.cannot('access', 'AdminMode'),
  };
  return Markup.keyboard([[packListBtn], [newPackBtn], [adminBtn], [settingsBtn]]).resize();
};
