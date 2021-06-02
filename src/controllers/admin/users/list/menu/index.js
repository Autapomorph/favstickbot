const { MenuTemplate } = require('telegraf-inline-menu');

const singleRoleMenu = require('./singleRole');
const { getMenuBody, getMenuChoices } = require('./helpers');
const options = require('./options');

const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singleRoleMenu, options);

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');

module.exports = menu;
