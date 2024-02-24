import path from 'node:path';

import { placeholderDir, defaultEmojis } from '../../config/stickers.js';

export const createPack = async (ctx, packToCreate) => {
  const placeholderExtenstion = packToCreate.isAnimated ? 'tgs' : 'png';
  const placeholderProp = `${placeholderExtenstion}_sticker`;
  const placeholderPath = path.resolve(placeholderDir, `placeholder.${placeholderExtenstion}`);

  return ctx.createNewStickerSet(packToCreate.name, packToCreate.title, {
    [placeholderProp]: { source: placeholderPath },
    emojis: defaultEmojis,
  });
};
