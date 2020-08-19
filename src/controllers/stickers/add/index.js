const Extra = require('telegraf/extra');

const Pack = require('../../../models/Pack');
const { replyErrorAddSticker } = require('./replies');
const { getUserFile } = require('../../../utils/stickers/get');
const addSticker = require('../../../utils/stickers/add');
const createPackTg = require('../../../utils/packs/create');
const generateDefaultPack = require('../../../utils/packs/default');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateRegexErrorType');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  await ctx.replyWithChatAction('upload_document');

  const { user } = ctx.session;
  const userFile = getUserFile(ctx);

  // If user's selected pack has improper `isAnimated` prop
  // Try to find a pack with proper `isAnimated` prop and make it the selected one
  if (user.selectedPack && user.selectedPack.isAnimated !== userFile.isAnimated) {
    user.selectedPack = await Pack.findOneByType(user.id, userFile.isAnimated);
    await user.save();
  }

  // If there's no selected pack for user
  // Create a new pack using defaults and make it the selected one
  if (!user.selectedPack) {
    const defaultPack = generateDefaultPack(user.id, ctx.botInfo.username, userFile.isAnimated);
    await createPackTg(ctx, defaultPack);
    user.selectedPack = await Pack.create(defaultPack);
    await user.save();
  }

  try {
    const { title, link } = await addSticker(ctx, userFile, user.selectedPack);
    return await ctx.replyWithHTML(
      ctx.i18n.t('stickers.add.reply.ok', {
        title,
        link,
      }),
      Extra.inReplyTo(ctx.message.message_id),
    );
  } catch (error) {
    const { STICKERSET_INVALID, STICKERS_TOO_MUCH } = ERROR_TYPES.TELEGRAM;
    if (validateError(STICKERSET_INVALID, error) || validateError(STICKERS_TOO_MUCH, error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error);
    }

    return replyErrorAddSticker(ctx, error);
  }
};
