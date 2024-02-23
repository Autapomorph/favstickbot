import { TelegramError } from 'telegraf';

import { Pack } from '../../../models/Pack.js';
import { replySuccess, replyErrorNoSuitablePacks, replyErrorAddSticker } from './replies.js';
import { getUserFile } from '../../../utils/stickers/get.js';
import { addSticker } from '../../../utils/stickers/add.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import { replyErrorUnknown } from '../../../utils/errors/reply.js';
import { validateTelegramErrorType } from '../../../utils/errors/validateErrorType.js';
import { createMeta } from '../../../utils/logger/meta/createMeta.js';
import { escapeHTML } from '../../../utils/common/escapeHTML.js';
import { logger } from '../../../utils/logger/index.js';

export const add = async ctx => {
  await ctx.sendChatAction('upload_document');

  const { user } = ctx.state;
  const userFile = getUserFile(ctx);

  // If user doesn't have a selected pack or it has improper `isAnimated` prop
  // Try to find a pack with proper `isAnimated` prop and make it the selected one
  if (user.selectedPack?.isAnimated !== userFile.isAnimated) {
    user.selectedPack = await Pack.findOne()
      .byUser(user.id)
      .byIsArchived(false)
      .byIsAnimated(userFile.isAnimated)
      .sort({ updatedAt: 'desc' });
    await user.save();
  }

  // If user still has no selected pack
  // Ask them to create a new one
  if (!user.selectedPack) {
    return replyErrorNoSuitablePacks(ctx, userFile.isAnimated);
  }

  try {
    const { title, link } = await addSticker(ctx, userFile, user.selectedPack);
    return await replySuccess(ctx, { title: escapeHTML(title), link });
  } catch (error) {
    if (!(error instanceof TelegramError)) {
      logger.error(error, createMeta(ctx));
      return replyErrorUnknown(ctx);
    }

    const errorsToSkip = [
      ERROR_TYPES.TELEGRAM.STICKERSET_INVALID,
      ERROR_TYPES.TELEGRAM.STICKERS_TOO_MUCH,
      ERROR_TYPES.TELEGRAM.STICKER_INVALID_EMOJIS,
      ERROR_TYPES.TELEGRAM.STICKER_PNG_NOPNG,
      ERROR_TYPES.TELEGRAM.STICKER_TGS_NOTGS,
    ];
    if (validateTelegramErrorType(errorsToSkip, error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error, createMeta(ctx));
    }

    return replyErrorAddSticker(ctx, error);
  }
};
