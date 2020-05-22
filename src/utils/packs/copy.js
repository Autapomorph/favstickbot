const addSticker = require('../stickers/add');

module.exports = async function* copyPack(ctx, packToCopy, onProgress) {
  const { user } = ctx.session;

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const [index, sticker] of packToCopy.stickers.entries()) {
    await onProgress(index);
    yield addSticker(ctx, sticker, user.selectedPack);
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */
};
