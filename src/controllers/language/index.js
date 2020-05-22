const actions = require('./actions');
const { langKeyboard } = require('./helpers');
const { translateMessages } = require('../../config');

const enter = async ctx => {
  const messageText = Object.values(translateMessages).join('\n');
  return ctx.reply(messageText, langKeyboard);
};

module.exports = {
  enter,
  actions,
};
