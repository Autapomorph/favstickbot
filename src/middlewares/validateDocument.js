import * as ERROR_TYPES from '../utils/errors/types/index.js';
import { replyErrorToMessage } from '../utils/errors/reply.js';

const validMimeTypes = ['image/jpeg', 'image/png'];

const replyErrorFileType = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.INVALID_FILE_TYPE);
};

export const validateDocument = async (ctx, next) => {
  const { sticker, photo, document } = ctx.message;

  if (!sticker && !photo && !validMimeTypes.includes(document?.mime_type)) {
    return replyErrorFileType(ctx);
  }

  return next();
};
