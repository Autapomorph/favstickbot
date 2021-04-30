const { ForbiddenError } = require('@casl/ability');

const getMenuBody = ctx => {
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', 'Stats');
  return ctx.i18n.t('menu.admin.stats.body');
};

const getMenuChoices = async ctx => {
  const intervals = ['hour', 'day', 'week', 'month', 'year', 'total'];
  return intervals.reduce((acc, interval) => {
    acc[interval] = ctx.i18n.t(`menu.admin.stats.actions.show.${interval}`);
    return acc;
  }, {});
};

module.exports = {
  getMenuBody,
  getMenuChoices,
};
