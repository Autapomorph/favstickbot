const createSticker = require('./create');
const downloadSticker = require('./download');
const uploadSticker = require('./upload');
const { normalizeImage } = require('../common/image');
const { packLinkPrefix } = require('../../config/packs');

const addSticker = async (ctx, userFile, pack) => {
  let fileBuffer = await downloadSticker(ctx, userFile.fileId);

  if (userFile.isAnimated === false) {
    fileBuffer = await normalizeImage(fileBuffer);
  }

  const stickerFile = await uploadSticker(
    ctx,
    fileBuffer,
    userFile.emoji,
    userFile.isAnimated,
    pack.name,
  );

  await createSticker(pack.id, userFile, stickerFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
  };
};

module.exports = addSticker;
