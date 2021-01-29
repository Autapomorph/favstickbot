const { MenuMiddleware } = require('telegraf-inline-menu');

const menu = require('../../controllers/settings/menu');

const menuMiddleware = new MenuMiddleware('/settings/', menu);

module.exports = menuMiddleware;
