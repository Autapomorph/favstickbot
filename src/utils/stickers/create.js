import { Sticker } from '../../models/Sticker.js';

export const createSticker = async (packId, userFile, stickerFile) => {
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
