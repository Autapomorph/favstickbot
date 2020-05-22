const { replyEnter, replyErrorCopy } = require('./helpers');
const logger = require('../../../utils/logger');

const enter = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('cmd.copy.reply'));
};

const command = async ctx => {
  const { packName } = ctx.match.groups;
  let packToCopy;

  try {
    packToCopy = await ctx.getStickerSet(packName);
  } catch (error) {
    logger.error(error);
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

module.exports = {
  enter,
  command,
};
