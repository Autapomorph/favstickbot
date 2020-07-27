const { replyEnter, replyErrorCopy } = require('./replies');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  const { packName } = ctx.match.groups;
  let packToCopy;

  try {
    packToCopy = await ctx.getStickerSet(packName);
  } catch (error) {
    // Bad Request: STICKERSET_INVALID
    if (/stickerset.*invalid/i.test(error.description)) {
      logger.error(error, { sentry: false });
    } else {
      logger.error(error);
    }

    return replyErrorCopy(ctx);
  }

  if (!packToCopy || !packToCopy.stickers.length) {
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
