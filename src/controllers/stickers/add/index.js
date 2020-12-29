const Extra = require('telegraf/extra');

const Pack = require('../../../models/Pack');
const { replyErrorAddSticker } = require('./replies');
const { getUserFile } = require('../../../utils/stickers/get');
const addSticker = require('../../../utils/stickers/add');
const createPack = require('../../../utils/packs/create');
const generateDefaultPack = require('../../../utils/packs/default');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateErrorType');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  await ctx.replyWithChatAction('upload_document');

  const { user } = ctx.session;
  const userFile = getUserFile(ctx);

  // If user doesn't have a selected pack or it has improper `isAnimated` prop
  // Try to find a pack with proper `isAnimated` prop and make it the selected one
  if (!user.selectedPack || user.selectedPack.isAnimated !== userFile.isAnimated) {
    user.selectedPack = await Pack.findOneVisibleByType(user.id, userFile.isAnimated);
    await user.save();
  }

  // If user has no selected pack
  // Create a new pack using defaults and make it the selected one
  if (!user.selectedPack) {
    const defaultPack = generateDefaultPack(user.id, ctx.botInfo.username, userFile.isAnimated);
    await createPack(ctx, defaultPack);
    user.selectedPack = await Pack.create(defaultPack);
    await user.save();
  }

  try {
    const { title, link } = await addSticker(ctx, userFile, user.selectedPack);
    return await ctx.replyWithHTML(
      ctx.i18n.t('operation.sticker.add.reply.ok', {
        title,
        link,
      }),
      { ...Extra.inReplyTo(ctx.message.message_id), allow_sending_without_reply: true },
    );
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
