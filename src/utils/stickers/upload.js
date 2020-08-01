const { getUploadedStickerFile } = require('./get');

const uploadSticker = async (ctx, source, emojis, isAnimated, packName) => {
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
    emojis: uploadedFile.emoji,
  };
};

module.exports = uploadSticker;
