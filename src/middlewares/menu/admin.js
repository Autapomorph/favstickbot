const { MenuMiddleware } = require('telegraf-inline-menu');

const menu = require('../../controllers/admin/menu');

const menuMiddleware = new MenuMiddleware('admin/', menu);

module.exports = menuMiddleware;
