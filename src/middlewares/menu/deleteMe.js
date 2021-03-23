const { MenuMiddleware } = require('telegraf-inline-menu');

const menu = require('../../controllers/deleteMe/menu');

const menuMiddleware = new MenuMiddleware('deleteMe/', menu);

module.exports = menuMiddleware;
