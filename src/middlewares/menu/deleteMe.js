const { MenuMiddleware } = require('telegraf-inline-menu');

const menu = require('../../controllers/deleteme/menu');

const menuMiddleware = new MenuMiddleware('deleteme/', menu);

module.exports = menuMiddleware;
