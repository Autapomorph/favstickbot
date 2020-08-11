const Extra = require('telegraf/extra');

const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const logger = require('../../../utils/logger');

const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.NOT_FOUND);
};

const replyOriginal = async (ctx, { type, fileId }) => {
  const replyExtra = Extra.inReplyTo(ctx.message.message_id);

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
    return replyErrorTelegram(ctx, error, replyExtra);
  }
};

module.exports = {
  replyOriginal,
  replyErrorNotFound,
};
