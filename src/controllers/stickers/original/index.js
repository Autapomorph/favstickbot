const Scene = require('telegraf/scenes/base');

const { replyOriginal, replyErrorNotFound } = require('./helpers');
const getCancelKeyboard = require('../../../keyboards/cancel');
const { getOriginalStickerByFileId } = require('../../../utils/stickers');

const stickersOriginalScene = new Scene('STICKERS_ORIGINAL');

stickersOriginalScene.enter(async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scenes.original.reply.enter'), getCancelKeyboard(ctx));
});

stickersOriginalScene.on('sticker', async ctx => {
  const sticker = await getOriginalStickerByFileId(ctx.message.sticker.file_unique_id);

  if (!sticker) {
    return replyErrorNotFound(ctx);
  }

  return replyOriginal(ctx, sticker);
});

module.exports = stickersOriginalScene;
