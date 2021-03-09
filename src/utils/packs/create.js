const path = require('path');

const { placeholderDir, defaultEmojis } = require('../../config/stickers');

module.exports = async (ctx, packToCreate) => {
  const placeholderExtenstion = packToCreate.isAnimated ? 'tgs' : 'png';
  const placeholderProp = `${placeholderExtenstion}_sticker`;
  const placeholderPath = path.resolve(placeholderDir, `placeholder.${placeholderExtenstion}`);

  return ctx.createNewStickerSet(packToCreate.name, packToCreate.title, {
    [placeholderProp]: { source: placeholderPath },
    emojis: defaultEmojis,
  });
};
