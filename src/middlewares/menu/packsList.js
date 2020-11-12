const { MenuMiddleware } = require('telegraf-inline-menu');

const menu = require('../../controllers/packs/list/menu');

const menuMiddleware = new MenuMiddleware('/packs/', menu);

module.exports = menuMiddleware.middleware();
