const Markup = require('telegraf/markup');

const { locales } = require('../../config');

const langButtons = Object.values(locales).map(locale =>
  Markup.callbackButton(locale.symbol, `language_set:${locale.code}`),
);

const langKeyboard = Markup.inlineKeyboard(langButtons, {
  columns: 5,
});

module.exports = {
  locales,
  langKeyboard,
};
