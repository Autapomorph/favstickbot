const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateRegexErrorType');

const replyErrorAddSticker = (ctx, error) => {
  if (validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.INVALID);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKERS_TOO_MUCH, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.TOO_MUCH);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKER_INVALID_EMOJIS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.INVALID_EMOJIS);
  }

  return replyErrorTelegram(ctx, error);
};

module.exports = {
  replyErrorAddSticker,
};
