const { MenuTemplate } = require('telegraf-inline-menu');

const {
  getMenuBody,
  getMenuChoices,
  getTotalPages,
  getCurrentPage,
  setPage,
} = require('./helpers');
const options = require('./options');
const singleUserMenu = require('../singleUser');

const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singleUserMenu, options);

menu.pagination('P', {
  getTotalPages,
  getCurrentPage,
  setPage,
});

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');

module.exports = menu;
