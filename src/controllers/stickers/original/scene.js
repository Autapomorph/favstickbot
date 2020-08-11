const Scene = require('telegraf/scenes/base');
const { drop } = require('telegraf/composer');

const Sticker = require('../../../models/Sticker');
const { replyOriginal, replyErrorNotFound } = require('./replies');
const getCancelKeyboard = require('../../../keyboards/cancel');

const stickersOriginalScene = new Scene('STICKERS_ORIGINAL');

stickersOriginalScene.enter(async ctx => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.original.reply.enter'),
    getCancelKeyboard(ctx).extra(),
  );
});

stickersOriginalScene.on('sticker', async ctx => {
  const sticker = await Sticker.findOneByUID(ctx.message.sticker.file_unique_id);

  if (!sticker) {
    return replyErrorNotFound(ctx);
  }

  return replyOriginal(ctx, sticker.original);
});

// Drop any updates
stickersOriginalScene.use(drop(true));

module.exports = stickersOriginalScene;
