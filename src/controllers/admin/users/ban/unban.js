const User = require('../../../../models/User');
const { parseIds } = require('./helpers');

module.exports = async ctx => {
  const parsedIds = parseIds(ctx.state.commandParts.splitArgs);
  if (parsedIds.length <= 0) {
    return ctx.reply(ctx.i18n.t('operation.user.unban.reply.error.empty_userlist'));
  }

  const { modifiedCount: usersCount } = await User.updateMany(
    { _id: { $in: parsedIds } },
    { ban: false },
  ).accessibleBy(ctx.state.ability, 'update');

  const templateData = ctx.state.ability.can('read', 'User', 'ban') ? usersCount : parsedIds.length;
  return ctx.reply(ctx.i18n.t('operation.user.unban.reply.ok', { usersCount: templateData }));
};
