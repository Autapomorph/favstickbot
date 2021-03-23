const { replyMenuToContext } = require('telegraf-inline-menu');

const menu = require('./menu');
const actions = require('./actions');

module.exports = async ctx => {
  return replyMenuToContext(menu, ctx, 'deleteMe/');
};

module.exports.actions = actions;
