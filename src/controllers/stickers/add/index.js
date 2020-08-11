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
  const { user } = ctx.session;

  await ctx.replyWithChatAction('upload_document');

  const userFile = getUserFile(ctx);
  const { isAnimated } = userFile;
  if (user.selectedPack && user.selectedPack.isAnimated !== isAnimated) {
    user.selectedPack = await Pack.findOneByType(user.id, isAnimated);
    await user.save();
  }

  if (!user.selectedPack) {
    const defaultPack = generateDefaultPack(user.id, ctx.botInfo.username, isAnimated);
    user.selectedPack = await Pack.create(defaultPack);
    await user.save();
  }

  if (!user.selectedPack.hasTgInstance) {
    await createPackTg(ctx, user.selectedPack);
    user.selectedPack.hasTgInstance = true;
    await user.selectedPack.save();
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
