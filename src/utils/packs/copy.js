const addSticker = require('../stickers/add');

module.exports = async (ctx, packToCopy, abortCheck, onProgress, onSuccess) => {
  const { user } = ctx.session;

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const [index, sticker] of packToCopy.stickers.entries()) {
    if (abortCheck()) return;
    await onProgress(index);
    await addSticker(ctx, sticker, user.selectedPack);
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */

  onSuccess();
};
