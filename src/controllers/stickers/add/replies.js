import { replyErrorToMessage, replyErrorTelegram } from '../../../utils/errors/reply.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import * as ERROR_SETS from '../../../utils/errors/sets/index.js';
import { validateTelegramErrorType } from '../../../utils/errors/validateErrorType.js';

export const replySuccess = async (ctx, { title, link }) => {
  return ctx.sendMessage(
    ctx.i18n.t('operation.sticker.add.reply.ok', {
      title,
      link,
    }),
    {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
      parse_mode: 'HTML',
    },
  );
};

export const replyErrorNoSuitablePacks = async (ctx, isAnimated) => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_SUITABLE_PACKS, {
    isAnimated,
  });
};

export const replyErrorAddSticker = async (ctx, error) => {
  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.PACK_INVALID);
  }

  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKERS_TOO_MUCH, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.STICKERS_TOO_MUCH);
  }

  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKER_INVALID_EMOJIS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.INVALID_EMOJIS);
  }

  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKER_PNG_NOPNG, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_PNG);
  }

  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKER_TGS_NOTGS, error)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.STICKERS.ADD.NO_TGS);
  }

  if (!validateTelegramErrorType(ERROR_SETS.DO_NOT_REPLY, error)) {
    return replyErrorTelegram(ctx, error);
  }
};
