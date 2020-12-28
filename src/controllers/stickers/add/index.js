const Pack = require('../../../models/Pack');
const { replySuccess, replyErrorNoSuitablePacks, replyErrorAddSticker } = require('./replies');
const { getUserFile } = require('../../../utils/stickers/get');
const addSticker = require('../../../utils/stickers/add');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateErrorType');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  await ctx.replyWithChatAction('upload_document');

  const { user } = ctx.state;
  const userFile = getUserFile(ctx);

  // If user's selected pack has improper `isAnimated` prop
  // Try to find a pack with proper `isAnimated` prop and make it the selected one
  if (user.selectedPack && user.selectedPack.isAnimated !== userFile.isAnimated) {
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
    const { STICKERSET_INVALID, STICKERS_TOO_MUCH, STICKER_INVALID_EMOJIS } = ERROR_TYPES.TELEGRAM;
    if (validateError([STICKERSET_INVALID, STICKERS_TOO_MUCH, STICKER_INVALID_EMOJIS], error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error);
    }

    return replyErrorAddSticker(ctx, error);
  }
};
