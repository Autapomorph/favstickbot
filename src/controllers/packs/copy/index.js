import { replyEnter, replyErrorNotFound } from './replies.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import { validateTelegramErrorType } from '../../../utils/errors/validateErrorType.js';
import { createMeta } from '../../../utils/logger/meta/createMeta.js';
import { logger } from '../../../utils/logger/index.js';

const baseCopy = async ctx => {
  const { packName } = ctx.match.groups;
  const packToCreate = {};
  const packToCopy = {};

  try {
    const { title, name, is_animated: isAnimated, stickers } = await ctx.getStickerSet(packName);
    packToCreate.isAnimated = isAnimated;
    packToCopy.title = title;
    packToCopy.name = name;
    packToCopy.isAnimated = isAnimated;
    packToCopy.stickers = stickers.map(sticker => ({
      fileId: sticker.file_id,
      fileUniqueId: sticker.file_unique_id,
      emoji: sticker.emoji,
      isAnimated: sticker.is_animated,
      type: 'sticker',
    }));
  } catch (error) {
    if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error, createMeta(ctx));
    }

    return replyErrorNotFound(ctx);
  }

  if (!packToCopy.stickers?.length) {
    return replyErrorNotFound(ctx);
  }

  await replyEnter(ctx);

  return ctx.scene.enter('PACKS/CREATE', {
    packToCreate,
    packToCopy,
    nextScene: 'PACKS/COPY',
  });
};

const replyCopy = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('cmd.copy.reply'), { parse_mode: 'HTML' });
};

export const copy = {
  base: baseCopy,
  reply: replyCopy,
};
