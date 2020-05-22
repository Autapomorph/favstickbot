const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/replyError');

const errorTypes = {
  FILE_TYPE: 'stickers.add.reply.error.file_type',
  STICKERS_TOO_MUCH: 'stickers.add.reply.error.stickers_too_much',
};

const replyErrorFileType = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.FILE_TYPE);
};

const replyErrorAddSticker = (ctx, error) => {
  if (error.description === 'Bad Request: STICKERS_TOO_MUCH') {
    return replyErrorToMessage(ctx, errorTypes.STICKERS_TOO_MUCH);
  }

  return replyErrorTelegram(ctx, error);
};

module.exports = {
  errorTypes,
  replyErrorFileType,
  replyErrorAddSticker,
};
