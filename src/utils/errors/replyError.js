const errorTypes = {
  TELEGRAM: 'shared.error.reply.telegram',
  RATELIMIT: 'shared.error.reply.ratelimit',
  UNKNOWN: 'shared.error.reply.unknown',
};

// Base reply error
const replyError = async (ctx, tKey, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(tKey), extra);
};

// Reply error with default message reply to
const replyErrorToMessage = async (ctx, tKey, messageID, extra = {}) => {
  const messageId = messageID || ctx.message.message_id;
  return replyError(ctx, tKey, {
    reply_to_message_id: messageId,
    ...extra,
  });
};

// Reply error with resource
const replyErrorWithResource = async (ctx, tKey, resource, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(tKey, resource), extra);
};

// Reply error with telegram error description
const replyErrorTelegram = async (ctx, error, extra = {}) => {
  return replyErrorWithResource(ctx, errorTypes.TELEGRAM, { error: error.description }, extra);
};

// Reply error ratelimit
const replyErrorRatelimit = async (ctx, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(errorTypes.RATELIMIT), extra);
};

// Reply unknown error
const replyErrorUnknown = async (ctx, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(errorTypes.UNKNOWN), extra);
};

module.exports = {
  replyError,
  replyErrorToMessage,
  replyErrorWithResource,
  replyErrorTelegram,
  replyErrorRatelimit,
  replyErrorUnknown,
};
