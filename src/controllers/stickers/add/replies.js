const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateRegexErrorType');

const replyErrorAddSticker = (ctx, error) => {
  if (validateError(ERROR_TYPES.TELEGRAM.STICKERS_TOO_MUCH, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.TOO_MUCH);
  }

  return replyErrorTelegram(ctx, error);
};

module.exports = {
  replyErrorAddSticker,
};
