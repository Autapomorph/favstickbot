const Sticker = require('../../models/Sticker');

const createSticker = async (packId, userFile, stickerFile) => {
  return Sticker.create({
    _id: stickerFile.fileId,
    packId,
    fileUniqueId: stickerFile.fileUniqueId,
    original: {
      fileId: userFile.fileId,
      type: userFile.type,
    },
  });
};

module.exports = createSticker;
