const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/replyError');

const errorTypes = {
  STICKERS_TOO_MUCH: 'stickers.add.reply.error.stickers_too_much',
};

const replyErrorAddSticker = (ctx, error) => {
  if (error.description === 'Bad Request: STICKERS_TOO_MUCH') {
    return replyErrorToMessage(ctx, errorTypes.STICKERS_TOO_MUCH);
  }

  return replyErrorTelegram(ctx, error);
};

module.exports = {
  errorTypes,
  replyErrorAddSticker,
};
