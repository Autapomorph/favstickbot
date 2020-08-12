const generateID = require('../common/generateID');

const DEFAULT_PACK_TITLES = {
  NORMAL: 'Favorite stickers',
  ANIMATED: 'Animated favorite stickers',
};

const generatePackName = botUsername => `fs${generateID()}_by_${botUsername}`;

const generatePackTitle = isAnimated =>
  isAnimated ? DEFAULT_PACK_TITLES.ANIMATED : DEFAULT_PACK_TITLES.NORMAL;

const generateDefaultPack = (userId, botUsername, isAnimated = false) => {
  return {
    userId,
    name: generatePackName(botUsername),
    title: generatePackTitle(isAnimated),
    isAnimated,
  };
};

module.exports = generateDefaultPack;
