const User = require('../../../../models/User');
const { parseIds } = require('./helpers');

module.exports = async ctx => {
  const userId = Number(ctx.state.user.id);
  const parsedIds = parseIds(ctx.state.commandParts.splitArgs);
  const userIds = parsedIds.filter(id => id !== userId);

  if (parsedIds.includes(userId)) {
    await ctx.reply(ctx.i18n.t('operation.user.unban.reply.error.forbid_yourself'));
  }

  if (userIds.length <= 0) {
    return ctx.reply(ctx.i18n.t('operation.user.unban.reply.error.empty_userlist'));
  }

  const { nModified: unbannedCount } = await User.updateMany(
    {
      _id: { $in: userIds },
      ban: true,
    },
    { $unset: { ban: true } },
  );

  return ctx.reply(ctx.i18n.t('operation.user.unban.reply.ok', { unbannedCount }));
};
