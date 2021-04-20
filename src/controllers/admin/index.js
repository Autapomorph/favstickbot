const { replyMenuToContext } = require('telegraf-inline-menu');

const menu = require('./menu');
const users = require('./users');
const stats = require('./stats');

const menuController = async ctx => {
  return replyMenuToContext(menu, ctx, 'admin/');
};

module.exports = {
  users,
  stats,
  menu: menuController,
};
