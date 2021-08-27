const { MenuTemplate } = require('telegraf-inline-menu');

const User = require('../../../../../../models/User');
const { getMenuBody } = require('./helpers');
const setRoleMenu = require('../setRole');

const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.admin.users.user.actions.ban'), 'b', {
  do: async ctx => {
    const { modifiedCount } = await User.updateOne({ _id: ctx.match[2] }, { ban: true });
    const answerTkey = 'menu.admin.users.user.ban.answer';
    if (modifiedCount) {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.ok`, { user: ctx.match[2] }));
    } else {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.error`, { user: ctx.match[2] }));
    }
    return true;
  },
  hide: async ctx => {
    const user = await User.findById(ctx.match[2]).select('ban');
    return user.ban === true;
  },
});

menu.interact(ctx => ctx.i18n.t('menu.admin.users.user.actions.unban'), 'u', {
  do: async ctx => {
    const { modifiedCount } = await User.updateOne({ _id: ctx.match[2] }, { ban: false });
    const answerTkey = 'menu.admin.users.user.unban.answer';
    if (modifiedCount) {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.ok`, { user: ctx.match[2] }));
    } else {
      await ctx.answerCbQuery(ctx.i18n.t(`${answerTkey}.error`, { user: ctx.match[2] }));
    }
    return true;
  },
  hide: async ctx => {
    const user = await User.findById(ctx.match[2]).select('ban');
    return user.ban !== true;
  },
});

menu.submenu(ctx => ctx.i18n.t('menu.admin.users.user.actions.set_role'), 'r', setRoleMenu);

menu.navigate(ctx => ctx.i18n.t('menu.admin.users.actions.back'), '..');

module.exports = menu;
