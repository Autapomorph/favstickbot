const Stage = require('telegraf/stage');
const Extra = require('telegraf/extra');
const { match } = require('telegraf-i18n');

const packCreateScenes = require('./packs/create/scene');
const stickerOriginalScene = require('./stickers/original/scene');
const getMainKeyboard = require('../keyboards/main');

const stage = new Stage([...packCreateScenes, stickerOriginalScene]);

stage.hears(['/cancel', match('keyboard.shared.cancel')], async ctx => {
  await ctx.reply(ctx.i18n.t('scene.shared.leave.reply'), {
    ...Extra.markup(getMainKeyboard(ctx)).inReplyTo(ctx.message.message_id),
    allow_sending_without_reply: true,
  });

  return ctx.scene.leave();
});

stage.middleware();

module.exports = stage;
