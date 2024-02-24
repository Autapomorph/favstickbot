import { Scenes } from 'telegraf';

import { packCreateScenes } from './packs/create/scene.js';
import { packCopyScene } from './packs/copy/scene.js';
import { stickerOriginalScene } from './stickers/original/scene.js';
import { getMainKeyboard } from '../keyboards/main.js';
import { match } from '../utils/i18n/match.js';

export const stage = new Scenes.Stage([
  ...Object.values(packCreateScenes),
  packCopyScene,
  stickerOriginalScene,
]);

stage.hears(['/cancel', match('keyboard.shared.cancel')], async ctx => {
  if (!ctx.scene.current) {
    await ctx.sendMessage(ctx.i18n.t('shared.reply.operation.cancel'), {
      ...getMainKeyboard(ctx),
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });

    return ctx.scene.leave();
  }

  let text;
  switch (ctx.scene.current.id) {
    case packCreateScenes.base.id:
    case packCreateScenes.type.id:
    case packCreateScenes.title.id:
    case packCreateScenes.name.id:
      text = ctx.i18n.t('scene.pack_create.reply.cancel');
      break;

    case packCopyScene.id:
      text = ctx.i18n.t('scene.pack_copy.reply.cancel');
      break;

    case stickerOriginalScene.id:
      text = ctx.i18n.t('scene.sticker_original.reply.cancel');
      break;

    default:
      text = ctx.i18n.t('scene.shared.reply.operation.cancel');
  }

  await ctx.sendMessage(text, {
    ...getMainKeyboard(ctx),
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });

  return ctx.scene.leave();
});
