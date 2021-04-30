const { MenuTemplate } = require('telegraf-inline-menu');
const { ForbiddenError } = require('@casl/ability');

const statsController = require('../index');
const { getMenuBody, getMenuChoices } = require('./helpers');

const menu = new MenuTemplate(getMenuBody);

menu.choose('show', getMenuChoices, {
  do: async ctx => {
    ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', 'Stats');
    await statsController(ctx);
    return true;
  },
  columns: 3,
});

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');

module.exports = menu;
