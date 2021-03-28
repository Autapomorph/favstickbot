const { adminList } = require('../../config/userLists');

module.exports = async ctx => {
  const supportChat = process.env.SUPPORT_CHAT || adminList[0];
  const feedbackText = ctx.state.commandParts?.args;

  if (!feedbackText?.trim().length) {
    return ctx.reply(ctx.i18n.t('operation.user.feedback.reply.error.empty'), {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });
  }

  const replyText =
    ctx.i18n.t('operation.user.feedback.message.from_user', {
      from: ctx.from.id,
    }) + feedbackText;

  await ctx.telegram.sendMessage(supportChat, replyText);
  return ctx.reply(ctx.i18n.t('operation.user.feedback.reply.ok.from_user'), {
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
};
