const actions = require('./actions');
const { langKeyboard } = require('./helpers');
const { locales } = require('../../config');

module.exports = async ctx => {
  const messageText = Object.values(locales)
    .map(locale => locale.selectTextWithSymbol)
    .join('\n');
  return ctx.reply(messageText, langKeyboard.extra());
};

module.exports.actions = actions;
