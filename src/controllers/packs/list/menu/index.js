const { MenuTemplate } = require('telegraf-inline-menu');

const singlePackMenu = require('./singlePack');
const options = require('./options');
const {
  getMenuBody,
  getMenuChoices,
  getTotalPages,
  getCurrentPage,
  setPage,
} = require('./helpers');

const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singlePackMenu, options);

menu.pagination('', {
  getTotalPages,
  getCurrentPage,
  setPage,
});

module.exports = menu;
