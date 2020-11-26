const Extra = require('telegraf/extra');

const { replyErrorToMessage, replyErrorTelegram } = require('../../../utils/errors/reply');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateErrorType');

const replySuccess = (ctx, { title, link }) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('operation.sticker.add.reply.ok', {
      title,
      link,
    }),
    { ...Extra.inReplyTo(ctx.message.message_id), allow_sending_without_reply: true },
  );
};

const replyErrorNoSuitablePacks = (ctx, isAnimated) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('operation.sticker.add.reply.error.no_suitable_packs', { isAnimated }),
  );
};

const replyErrorAddSticker = (ctx, error) => {
  const { STICKERSET_INVALID, STICKERS_TOO_MUCH, STICKER_INVALID_EMOJIS } = ERROR_TYPES.TELEGRAM;

  if (validateError(STICKERSET_INVALID, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.INVALID);
  }

  if (validateError(STICKERS_TOO_MUCH, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.TOO_MUCH);
  }

  if (validateError(STICKER_INVALID_EMOJIS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.STICKERS.INVALID_EMOJIS);
  }

  return replyErrorTelegram(ctx, error);
};

module.exports = {
  replySuccess,
  replyErrorNoSuitablePacks,
  replyErrorAddSticker,
};
