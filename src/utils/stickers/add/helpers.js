const Sticker = require('../../../models/Sticker');
const { packLinkPrefix } = require('../../../config');
const downloadFile = require('../../common/downloadFile');
const { getNormalizedImage } = require('../../common/image');

const downloadSticker = async (ctx, inputFile) => {
  const fileUrl = await ctx.telegram.getFileLink(inputFile.fileId);
  return downloadFile(fileUrl);
};

const getUploadedStickerFile = async (ctx, packName) => {
  const pack = await ctx.getStickerSet(packName);
  return pack.stickers.slice(-1)[0];
};

const addSticker = async (ctx, source, emojis, isAnimated, packName) => {
  const placeholderExtenstion = isAnimated ? 'tgs' : 'png';
  const placeholderProp = `${placeholderExtenstion}_sticker`;

  await ctx.addStickerToSet(packName, {
    [placeholderProp]: { source },
    emojis,
  });

  const uploadedFile = await getUploadedStickerFile(ctx, packName);
  return {
    fileId: uploadedFile.file_id,
    fileUniqueId: uploadedFile.file_unique_id,
  };
};

const addStatic = async (ctx, inputFile, pack, emojis) => {
  const stickerFile = await downloadSticker(ctx, inputFile);
  const normalizedImage = await getNormalizedImage(stickerFile);

  const uploadedFile = await addSticker(ctx, normalizedImage, emojis, false, pack.name);
  await Sticker.createNew(pack.id, emojis, inputFile, uploadedFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
    sticker: uploadedFile,
  };
};

const addAnimated = async (ctx, inputFile, pack, emojis) => {
  const stickerFile = await downloadSticker(ctx, inputFile);

  const uploadedFile = await addSticker(ctx, stickerFile, emojis, true, pack.name);
  await Sticker.createNew(pack.id, emojis, inputFile, uploadedFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
    sticker: uploadedFile,
  };
};

module.exports = {
  addStatic,
  addAnimated,
};
