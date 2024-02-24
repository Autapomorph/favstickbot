import { Scenes, Composer } from 'telegraf';
import { message } from 'telegraf/filters';

import { Sticker } from '../../../models/Sticker.js';
import { replyOriginal, replyErrorNotFound } from './replies.js';
import { getCancelKeyboard } from '../../../keyboards/cancel.js';

export const stickerOriginalScene = new Scenes.BaseScene('STICKERS/ORIGINAL');

stickerOriginalScene.enter(async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.sticker_original.reply.enter'), {
    ...getCancelKeyboard(ctx),
    parse_mode: 'HTML',
  });
});

stickerOriginalScene.on(message('sticker'), async ctx => {
  const sticker = await Sticker.findOne().byUID(ctx.message.sticker.file_unique_id);

  if (!sticker) {
    return replyErrorNotFound(ctx);
  }

  return replyOriginal(ctx, sticker.original);
});

stickerOriginalScene.on(message(), async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.sticker_original.reply.help'), {
    ...getCancelKeyboard(ctx),
  });
});

// Drop any updates
stickerOriginalScene.use(Composer.drop(true));
