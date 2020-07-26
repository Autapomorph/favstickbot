const Sticker = require('../../models/Sticker');
const downloadSticker = require('./download');
const uploadSticker = require('./upload');
const { normalizeImage } = require('../common/image');
const { packLinkPrefix } = require('../../config');

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

const addStatic = async (ctx, userFile, pack) => {
  const userFileBuffer = await downloadSticker(ctx, userFile.fileId);
  const fileBuffer = await normalizeImage(userFileBuffer);
  const stickerFile = await uploadSticker(ctx, fileBuffer, userFile.emoji, false, pack.name);
  await createSticker(pack.id, userFile, stickerFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
  };
};

const addAnimated = async (ctx, userFile, pack) => {
  const fileBuffer = await downloadSticker(ctx, userFile.fileId);
  const stickerFile = await uploadSticker(ctx, fileBuffer, userFile.emoji, true, pack.name);
  await createSticker(pack.id, userFile, stickerFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
  };
};

module.exports = async (ctx, userFile, pack) => {
  if (userFile.isAnimated) {
    return addAnimated(ctx, userFile, pack);
  }

  return addStatic(ctx, userFile, pack);
};
