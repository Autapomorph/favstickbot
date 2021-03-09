const User = require('../../../../models/User');
const { ownerSet } = require('../../../../config/userLists');
const { parseIds } = require('./helpers');

module.exports = async ctx => {
  const userId = Number(ctx.state.user.id);
  const parsedIds = parseIds(ctx.state.commandParts.splitArgs);
  const userIds = parsedIds.filter(id => id !== userId && !ownerSet.has(id));

  if (parsedIds.includes(userId)) {
    await ctx.reply(ctx.i18n.t('operation.user.ban.reply.error.forbid_yourself'));
  }

  if (userIds.length <= 1) return;

  const { nModified: bannedCount } = await User.updateMany(
    {
      _id: { $in: userIds },
      ban: { $exists: false },
    },
    { ban: true },
  );

  return ctx.reply(ctx.i18n.t('operation.user.ban.reply.ok', { bannedCount }));
};
