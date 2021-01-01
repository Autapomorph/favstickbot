const Extra = require('telegraf/extra');

const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const ERROR_SETS = require('../../../utils/errors/errorSets');
const validateError = require('../../../utils/errors/validateErrorType');
const logger = require('../../../utils/logger');

const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.NOT_FOUND);
};

const replyOriginal = async (ctx, { type, fileId }) => {
  const replyExtra = {
    ...Extra.inReplyTo(ctx.message.message_id),
    allow_sending_without_reply: true,
  };

  try {
    switch (type) {
      case 'sticker':
        return await ctx.replyWithSticker(fileId, replyExtra);

      case 'photo':
        return await ctx.replyWithPhoto(fileId, replyExtra);

      case 'document':
        return await ctx.replyWithDocument(fileId, replyExtra);

      default:
        return replyErrorNotFound(ctx);
    }
  } catch (error) {
    logger.error(error);
    if (!validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      return replyErrorTelegram(ctx, error, replyExtra);
    }
  }
};

module.exports = {
  replyOriginal,
  replyErrorNotFound,
};
