const Markup = require('telegraf/markup');

const getPackListKeyboard = (packs, selectedPackId) => {
  return packs.map(({ id, title, isAnimated }) => {
    let packText = isAnimated ? `🅰️ ${title}` : title;
    packText = String(selectedPackId) === String(id) ? `✅ ${packText}` : packText;
    return [Markup.callbackButton(packText, `pack_select:${id}`)];
  });
};

const getPackListText = (ctx, packs) =>
  packs.length ? ctx.i18n.t('cmd.packs.reply.list') : ctx.i18n.t('cmd.packs.reply.empty');

module.exports = {
  getPackListText,
  getPackListKeyboard,
};
