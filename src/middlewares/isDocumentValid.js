const { replyErrorToMessage } = require('../utils/errors/replyError');

const validMimeTypes = ['image/jpeg', 'image/png'];

const errorTypes = {
  FILE_TYPE: 'stickers.add.reply.error.file_type',
};

const replyErrorFileType = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.FILE_TYPE);
};

module.exports = async (ctx, next) => {
  const { sticker, photo, document } = ctx.message;

  if (!sticker && !photo && !document) {
    return replyErrorFileType(ctx);
  }

  if (document && !validMimeTypes.includes(document.mime_type)) {
    return replyErrorFileType(ctx);
  }

  return next();
};
