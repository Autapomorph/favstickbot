const { addStatic, addAnimated } = require('./helpers');
const { defaultEmojis } = require('../../../config');

module.exports = async (ctx, inputFile, pack) => {
  const emojis = inputFile.emoji || defaultEmojis;

  if (inputFile.is_animated) {
    return addAnimated(ctx, inputFile, pack, emojis);
  }

  return addStatic(ctx, inputFile, pack, emojis);
};
