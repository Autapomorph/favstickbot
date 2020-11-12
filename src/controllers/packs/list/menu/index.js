const { MenuTemplate } = require('telegraf-inline-menu');

const singlePackMenu = require('./singlePack');
const { getMenuBody, getMenuChoices } = require('./helpers');

const menu = new MenuTemplate(getMenuBody);

menu.chooseIntoSubmenu('', getMenuChoices, singlePackMenu, {
  columns: 1,
  maxRows: 5,
  getCurrentPage: ctx => ctx.session.packListPage || 1,
  setPage: (ctx, page) => {
    ctx.session.packListPage = page;
  },
});

module.exports = menu;
