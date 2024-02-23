import * as ERROR_TYPES from './types/index.js';

// Base reply error
export const replyError = async (ctx, tKey, resource, extra = {}) => {
  return ctx.sendMessage(ctx.i18n.t(tKey, resource), { ...extra, parse_mode: 'HTML' });
};

// Reply error to specified message
export const replyErrorToMessage = async (
  ctx,
  tKey,
  resource,
  messageId = ctx.message?.message_id,
  extra = {},
) => {
  return replyError(ctx, tKey, resource, {
    reply_to_message_id: messageId,
    allow_sending_without_reply: true,
    ...extra,
  });
};

// Reply error with telegram error description
export const replyErrorTelegram = async (ctx, error, extra) => {
  return replyError(ctx, ERROR_TYPES.APP.REPLY, { error: error.description }, extra);
};

// Reply forbidden error
export const replyErrorForbidden = async (ctx, extra) => {
  return replyError(ctx, ERROR_TYPES.APP.FORBIDDEN.REPLY, null, extra);
};

// Reply unknown error
export const replyErrorUnknown = async (ctx, extra) => {
  return replyError(ctx, ERROR_TYPES.APP.UNKNOWN, null, extra);
};
