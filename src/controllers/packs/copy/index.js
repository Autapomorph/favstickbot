const { replyEnter, replyErrorCopy } = require('./replies');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateRegexErrorType');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  const { packName } = ctx.match.groups;
  const packToCopy = {};

  try {
    const { title, name, is_animated: isAnimated, stickers } = await ctx.getStickerSet(packName);
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
    if (validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error);
    }

    return replyErrorCopy(ctx);
  }

  if (!packToCopy.stickers || !packToCopy.stickers.length) {
    return replyErrorCopy(ctx);
  }

  await replyEnter(ctx);

  return ctx.scene.enter('PACKS_CREATE', {
    packToCopy,
  });
};

module.exports.reply = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('cmd.copy.reply'));
};
