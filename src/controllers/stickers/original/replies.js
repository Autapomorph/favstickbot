const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/types');
const ERROR_SETS = require('../../../utils/errors/sets');
const validateError = require('../../../utils/errors/validateErrorType');
const createMeta = require('../../../utils/logger/meta/createMeta');
const logger = require('../../../utils/logger');

const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ORIGINAL.STICKER_NOT_FOUND);
};

const replyOriginal = async (ctx, { type, fileId }) => {
  const replyExtra = {
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  };

  try {
    switch (type) {
      case 'sticker':
        return await ctx.sendSticker(fileId, replyExtra);

      case 'photo':
        return await ctx.sendPhoto(fileId, replyExtra);

      case 'document':
        return await ctx.sendDocument(fileId, replyExtra);

      default:
        return replyErrorNotFound(ctx);
    }
  } catch (error) {
    logger.error(error, createMeta(ctx));
    if (!validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      return replyErrorTelegram(ctx, error, replyExtra);
    }
  }
};

module.exports = {
  replyOriginal,
  replyErrorNotFound,
};
