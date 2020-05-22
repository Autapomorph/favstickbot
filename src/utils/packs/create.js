const path = require('path');

const { placeholderDir, defaultEmojis } = require('../../config');

module.exports = async (ctx, packToCreate) => {
  const placeholderExtenstion = packToCreate.isAnimated ? 'tgs' : 'png';
  const placeholderProp = `${placeholderExtenstion}_sticker`;
  const placeholderPath = path.resolve(placeholderDir, `placeholder.${placeholderExtenstion}`);

  await ctx.createNewStickerSet(packToCreate.name, packToCreate.title, {
    [placeholderProp]: { source: placeholderPath },
    emojis: defaultEmojis,
  });

  const createdPack = await ctx.getStickerSet(packToCreate.name);
  const stickerToDelete = createdPack.stickers.slice(-1)[0];
  return ctx.deleteStickerFromSet(stickerToDelete.file_id);
};
