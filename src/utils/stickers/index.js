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
      ...sticker,
      type: 'sticker',
    };
  }

  if (photo) {
    return {
      ...photo.slice(-1)[0],
      is_animated: false,
      type: 'photo',
      emoji: caption,
    };
  }

  if (document) {
    return {
      ...document,
      is_animated: false,
      type: 'document',
      emoji: caption,
    };
  }
};

module.exports = {
  getStickerFile,
  getOriginalStickerByFileId,
};
