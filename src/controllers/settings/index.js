const { replyMenuToContext } = require('telegraf-inline-menu');

const menu = require('./menu');

module.exports = async ctx => {
  return replyMenuToContext(menu, ctx, 'settings/');
};
