const Extra = require('telegraf/extra');

const ERROR_TYPES = require('./errorTypes');

// Base reply error
const replyError = async (ctx, tKey, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(tKey), extra);
};

// Reply error with resource
const replyErrorWithResource = async (ctx, tKey, resource, extra = {}) => {
  return ctx.replyWithHTML(ctx.i18n.t(tKey, resource), extra);
};

// Reply error to specified message
const replyErrorToMessage = async (ctx, tKey, messageId = ctx.message.message_id, extra = {}) => {
  return replyError(ctx, tKey, {
    ...Extra.inReplyTo(messageId),
    allow_sending_without_reply: true,
    ...extra,
  });
};

// Reply error with telegram error description
const replyErrorTelegram = async (ctx, error, extra) => {
  return replyErrorWithResource(ctx, ERROR_TYPES.REPLY, { error: error.description }, extra);
};

// Reply unknown error
const replyErrorUnknown = async (ctx, extra) => {
  return replyError(ctx, ERROR_TYPES.UNKNOWN, extra);
};

module.exports = {
  replyError,
  replyErrorToMessage,
  replyErrorWithResource,
  replyErrorTelegram,
  replyErrorUnknown,
};
