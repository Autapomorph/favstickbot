const { Scenes } = require('telegraf');
const { match } = require('telegraf-i18n');

const packCreateScenes = require('./packs/create/scene');
const packCopyScene = require('./packs/copy/scene');
const stickerOriginalScene = require('./stickers/original/scene');
const getMainKeyboard = require('../keyboards/main');

const stage = new Scenes.Stage([...packCreateScenes, packCopyScene, stickerOriginalScene]);

stage.hears(['/cancel', match('keyboard.shared.cancel')], async ctx => {
  await ctx.reply(ctx.i18n.t('scene.shared.leave.reply'), {
    ...getMainKeyboard(ctx),
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });

  return ctx.scene.leave();
});

stage.middleware();

module.exports = stage;
