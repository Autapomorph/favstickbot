const { TelegramError } = require('telegraf');

const Pack = require('../../../models/Pack');
const { replySuccess, replyErrorNoSuitablePacks, replyErrorAddSticker } = require('./replies');
const { getUserFile } = require('../../../utils/stickers/get');
const addSticker = require('../../../utils/stickers/add');
const ERROR_TYPES = require('../../../utils/errors/types');
const { replyErrorUnknown } = require('../../../utils/errors/reply');
const validateError = require('../../../utils/errors/validateErrorType');
const createMeta = require('../../../utils/logger/meta/createMeta');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  await ctx.replyWithChatAction('upload_document');

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
    return replySuccess(ctx, { title, link });
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
    if (validateError(errorsToSkip, error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error, createMeta(ctx));
    }

    return replyErrorAddSticker(ctx, error);
  }
};
