const Pack = require('../../models/Pack');

const getSelectedPackId = user => user.selectedPack && user.selectedPack.id;

const getPackById = async packId => {
  return Pack.findById(packId);
};

const getVisiblePack = async ownerId => {
  return Pack.findOne({
    owner: ownerId,
    isHidden: false,
    hasTgInstance: true,
  });
};

const getVisiblePacks = async ownerId => {
  return Pack.find({
    owner: ownerId,
    isHidden: false,
    hasTgInstance: true,
  });
};

const getHiddenPackByName = async (ownerId, name) => {
  return Pack.findOne({
    owner: ownerId,
    name,
    isHidden: true,
    hasTgInstance: true,
  });
};

const getPackByType = async (ownerId, isAnimated) => {
  return Pack.findOne({
    owner: ownerId,
    isAnimated,
    isHidden: false,
    hasTgInstance: true,
  });
};

module.exports = {
  getPackById,
  getPackByType,
  getVisiblePack,
  getVisiblePacks,
  getSelectedPackId,
  getHiddenPackByName,
};
