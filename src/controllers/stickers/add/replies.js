const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/types');
const ERROR_SETS = require('../../../utils/errors/sets');
const validateError = require('../../../utils/errors/validateErrorType');

const replySuccess = (ctx, { title, link }) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('operation.sticker.add.reply.ok', {
      title,
      link,
    }),
    {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    },
  );
};

const replyErrorNoSuitablePacks = (ctx, isAnimated) => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_SUITABLE_PACKS, {
    isAnimated,
  });
};

const replyErrorAddSticker = (ctx, error) => {
  if (validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.PACK_INVALID);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKERS_TOO_MUCH, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.STICKERS_TOO_MUCH);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKER_INVALID_EMOJIS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.INVALID_EMOJIS);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKER_PNG_NOPNG, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_PNG);
  }

  if (validateError(ERROR_TYPES.TELEGRAM.STICKER_TGS_NOTGS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_TGS);
  }

  if (!validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
    return replyErrorTelegram(ctx, error);
  }
};

module.exports = {
  replySuccess,
  replyErrorNoSuitablePacks,
  replyErrorAddSticker,
};
