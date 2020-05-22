const Markup = require('telegraf/markup');

const { locales } = require('../../config');

const cbLangButtons = Object.entries(locales).map(([key, val]) => {
  return Markup.callbackButton(val, `language_set:${key}`);
});

const langKeyboard = Markup.inlineKeyboard(cbLangButtons, {
  columns: 5,
}).extra();

module.exports = {
  locales,
  langKeyboard,
};
