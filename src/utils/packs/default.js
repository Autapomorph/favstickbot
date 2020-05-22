const generateID = require('../common/generateID');

const prepareDefaultPack = (ownerId, botUsername, isAnimated = false) => {
  return {
    owner: ownerId,
    name: `fs${generateID()}_by_${botUsername}`,
    title: isAnimated ? 'Animated favorite stickers' : 'Favorite stickers',
    isAnimated,
  };
};

module.exports = prepareDefaultPack;
