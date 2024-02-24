import { addSticker } from '../stickers/add.js';

export const copyPack = async (ctx, packToCopy, getIsAborted, onProgress) => {
  const { user } = ctx.state;

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const [index, sticker] of packToCopy.stickers.entries()) {
    if (await getIsAborted()) return false;
    await onProgress(index);
    await addSticker(ctx, sticker, user.selectedPack);
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */

  return true;
};
