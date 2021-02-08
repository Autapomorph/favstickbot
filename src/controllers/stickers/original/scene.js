const { Scenes } = require('telegraf');
const { drop } = require('telegraf').Composer;

const Sticker = require('../../../models/Sticker');
const { replyOriginal, replyErrorNotFound } = require('./replies');
const getCancelKeyboard = require('../../../keyboards/cancel');

const stickersOriginalScene = new Scenes.BaseScene('STICKERS/ORIGINAL');

stickersOriginalScene.enter(async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scene.sticker_original.reply.enter'), {
    ...getCancelKeyboard(ctx),
  });
});

stickersOriginalScene.on('sticker', async ctx => {
  const sticker = await Sticker.findOne().byUID(ctx.message.sticker.file_unique_id);

  if (!sticker) {
    return replyErrorNotFound(ctx);
  }

  return replyOriginal(ctx, sticker.original);
});

stickersOriginalScene.on('message', async ctx => {
  return ctx.reply(ctx.i18n.t('scene.sticker_original.reply.help'), { ...getCancelKeyboard(ctx) });
});

// Drop any updates
stickersOriginalScene.use(drop(true));

module.exports = stickersOriginalScene;
