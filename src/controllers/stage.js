const Stage = require('telegraf/stage');
const { match } = require('telegraf-i18n');

const packCreateScenes = require('./packs/create');
const stickerOriginalScene = require('./stickers/original');
const getMainKeyboard = require('../keyboards/main');

const stage = new Stage([...packCreateScenes, stickerOriginalScene]);

stage.hears(['/cancel', match('shared.scene.leave.btn.cancel')], async ctx => {
  await ctx.reply(ctx.i18n.t('shared.scene.leave.reply'), {
    reply_to_message_id: ctx.message.message_id,
    ...getMainKeyboard(ctx),
  });

  return ctx.scene.leave();
});

stage.middleware();

module.exports = stage;
