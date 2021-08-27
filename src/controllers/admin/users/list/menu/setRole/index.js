const { MenuTemplate } = require('telegraf-inline-menu');
const { noCase } = require('change-case');

const User = require('../../../../../../models/User');
const { getMenuBody, getMenuChoices } = require('./helpers');
const { rolesEnum } = require('../../../../../../config/roles');

const menu = new MenuTemplate(getMenuBody);

menu.choose('', getMenuChoices, {
  do: async ctx => {
    const role = rolesEnum[ctx.match[3]];
    const userId = ctx.match[2];

    const { modifiedCount } = await User.updateOne({ _id: userId }, { role });
    const answerTkey = 'menu.admin.users.user.set_role.answer';
    if (modifiedCount) {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.ok`, { user: userId, role: noCase(role) }));
    } else {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.error`, { user: userId }));
    }

    return `../../../:${ctx.match[3]}/`;
  },
  columns: 1,
});

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');

module.exports = menu;
