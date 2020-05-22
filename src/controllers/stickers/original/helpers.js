const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/replyError');
const logger = require('../../../utils/logger');

const errorTypes = {
  NOT_FOUND: 'scenes.original.reply.error.not_found',
};

const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.NOT_FOUND);
};

const replyOriginal = async (ctx, sticker) => {
  const { fileType, fileId } = sticker.original;
  const replyExtra = {
    caption: sticker.emojis,
    reply_to_message_id: ctx.message.message_id,
  };

  try {
    switch (fileType) {
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
  errorTypes,
  replyErrorNotFound,
};
