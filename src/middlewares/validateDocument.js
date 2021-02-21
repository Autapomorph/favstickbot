const ERROR_TYPES = require('../utils/errors/types');
const { replyErrorToMessage } = require('../utils/errors/reply');

const validMimeTypes = ['image/jpeg', 'image/png'];

const replyErrorFileType = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.INVALID_FILE_TYPE);
};

module.exports = async (ctx, next) => {
  const { sticker, photo, document } = ctx.message;

  if (!sticker && !photo && !validMimeTypes.includes(document?.mime_type)) {
    return replyErrorFileType(ctx);
  }

  return next();
};
