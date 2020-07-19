const Sticker = require('../../models/Sticker');

const getOriginalStickerByFileId = async fileUniqueId => {
  return Sticker.findOne({
    fileUniqueId,
    original: { $ne: null },
  });
};

const getStickerFile = ctx => {
  const { sticker, photo, document, caption } = ctx.message;

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
  getStickerFile,
  getOriginalStickerByFileId,
};
