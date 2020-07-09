const actions = require('./actions');
const { langKeyboard } = require('./helpers');
const { locales } = require('../../config');

const enter = async ctx => {
  const messageText = Object.values(locales)
    .map(locale => locale.selectTextWithSymbol)
    .join('\n');
  return ctx.reply(messageText, langKeyboard);
};

module.exports = {
  enter,
  actions,
};
