const Sticker = require('../../models/Sticker');

const getOriginalStickerByFileId = async fileUniqueId => {
  return Sticker.findOne({
    fileUniqueId,
    original: { $ne: null },
  });
};

const getStickerFile = ctx => {
  const updateSubType = ctx.updateSubTypes[0];
  const { sticker, document, photo, caption } = ctx.message;
  const stickerMimeTypes = ['image/jpeg', 'image/png'];

  switch (updateSubType) {
    case 'sticker': {
      return {
        ...sticker,
        type: 'sticker',
      };
    }

    case 'photo': {
      return {
        ...photo.slice(-1)[0],
        type: 'photo',
        emoji: caption,
      };
    }

    case 'document': {
      // Mime type in invalid
      if (!stickerMimeTypes.includes(document.mime_type)) {
        return;
      }

      return {
        ...document,
        type: 'document',
        emoji: caption,
      };
    }

    default:
  }
};

module.exports = {
  getStickerFile,
  getOriginalStickerByFileId,
};
