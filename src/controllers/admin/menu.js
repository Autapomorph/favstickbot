const { MenuTemplate } = require('telegraf-inline-menu');

const { getMenuBody } = require('./helpers');
const statsMenu = require('./stats/menu');

const menu = new MenuTemplate(getMenuBody);

menu.submenu(
  ctx => (ctx.state.ability.can('read', 'Stats') ? ctx.i18n.t('menu.admin.actions.stats') : ''),
  'stats',
  statsMenu,
);

module.exports = menu;
