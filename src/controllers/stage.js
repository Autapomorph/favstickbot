const Stage = require('telegraf/stage');
const Extra = require('telegraf/extra');
const { match } = require('telegraf-i18n');

const packCreateScenes = require('./packs/create/scene');
const stickerOriginalScene = require('./stickers/original/scene');
const getMainKeyboard = require('../keyboards/main');

const stage = new Stage([...packCreateScenes, stickerOriginalScene]);

stage.hears(['/cancel', match('shared.scene.leave.btn.cancel')], async ctx => {
  await ctx.reply(
    ctx.i18n.t('shared.scene.leave.reply'),
    Extra.markup(getMainKeyboard(ctx)).inReplyTo(ctx.message.message_id),
  );

  return ctx.scene.leave();
});

stage.middleware();

module.exports = stage;
