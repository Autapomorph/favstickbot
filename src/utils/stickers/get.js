import { defaultEmojis } from '../../config/stickers.js';

export const getUploadedStickerFile = async (ctx, packName) => {
  const pack = await ctx.getStickerSet(packName);
  return pack.stickers[pack.stickers.length - 1];
};

export const getUserFile = ctx => {
  const { sticker, photo, document, emoji = defaultEmojis, caption = defaultEmojis } = ctx.message;

  if (sticker) {
    return {
      type: 'sticker',
      fileId: sticker.file_id,
      fileUniqueId: sticker.file_unique_id,
      emoji,
      isAnimated: sticker.is_animated,
    };
  }

  if (photo) {
    const photoSize = photo[photo.length - 1];
    return {
      type: 'photo',
      fileId: photoSize.file_id,
      fileUniqueId: photoSize.file_unique_id,
      emoji: caption,
      isAnimated: false,
    };
  }

  if (document) {
    return {
      type: 'document',
      fileId: document.file_id,
      fileUniqueId: document.file_unique_id,
      emoji: caption,
      isAnimated: false,
    };
  }
};
