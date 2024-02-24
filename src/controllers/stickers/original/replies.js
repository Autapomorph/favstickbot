import { replyErrorToMessage, replyErrorTelegram } from '../../../utils/errors/reply.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import * as ERROR_SETS from '../../../utils/errors/sets/index.js';
import { validateTelegramErrorType } from '../../../utils/errors/validateErrorType.js';
import { createMeta } from '../../../utils/logger/meta/createMeta.js';
import { logger } from '../../../utils/logger/index.js';

export const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ORIGINAL.STICKER_NOT_FOUND);
};

export const replyOriginal = async (ctx, { type, fileId }) => {
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
    if (!validateTelegramErrorType(ERROR_SETS.DO_NOT_REPLY, error)) {
      return replyErrorTelegram(ctx, error, replyExtra);
    }
  }
};
