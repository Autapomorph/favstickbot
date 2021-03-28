module.exports = async (ctx, next) => {
  const replyTo = ctx.message.reply_to_message;

  if (!replyTo?.entities) {
    return next();
  }

  const userIdEntity = replyTo.entities.find(e => e.type === 'hashtag');
  if (!userIdEntity) {
    return next();
  }

  const userIdStartIndex = userIdEntity.offset + 3;
  const userIdEndIndex = userIdEntity.offset + userIdEntity.length;
  const userId = replyTo.text.slice(userIdStartIndex, userIdEndIndex);
  const replyText = ctx.i18n.t('operation.user.feedback.message.from_support') + ctx.message.text;

  await ctx.telegram.sendMessage(userId, replyText);
  return ctx.reply(ctx.i18n.t('operation.user.feedback.reply.ok.from_support'), {
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
};
