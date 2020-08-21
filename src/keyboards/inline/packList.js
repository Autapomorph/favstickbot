const Markup = require('telegraf/markup');

const getPackListKeyboard = (packs, selectedPackId) => {
  return packs.map(({ id, title, isAnimated }) => {
    let packText = isAnimated ? `🅰️ ${title}` : title;
    packText = String(selectedPackId) === String(id) ? `✅ ${packText}` : packText;
    return [Markup.callbackButton(packText, `pack_select:${id}`)];
  });
};

module.exports = getPackListKeyboard;
