const Sticker = require('../../models/Sticker');
const { defaultEmojis } = require('../../config');

const getStickerByFileUniqueId = async fileUniqueId => {
  return Sticker.findOne({
    fileUniqueId,
  });
};

const getUploadedStickerFile = async (ctx, packName) => {
  const pack = await ctx.getStickerSet(packName);
  return pack.stickers[pack.stickers.length - 1];
};

const getUserFile = ctx => {
  const { sticker, photo, document, caption = defaultEmojis } = ctx.message;

  if (sticker) {
    return {
      type: 'sticker',
      fileId: sticker.file_id,
      fileUniqueId: sticker.file_unique_id,
      emoji: sticker.emoji,
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

module.exports = {
  getUserFile,
  getUploadedStickerFile,
  getStickerByFileUniqueId,
};
