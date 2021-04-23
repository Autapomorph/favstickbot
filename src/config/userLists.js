const splitUserIdsString = require('../utils/common/splitUserIdsString');

const { OWNER_LIST, DEV_MODE_ALLOW_LIST } = process.env;

const ownerList = splitUserIdsString(OWNER_LIST);
const ownerSet = new Set(ownerList);

const devModeAllowedList = splitUserIdsString(DEV_MODE_ALLOW_LIST);
const devModeAllowedSet = new Set(devModeAllowedList);

module.exports = {
  ownerList,
  ownerSet,
  devModeAllowedList,
  devModeAllowedSet,
};
