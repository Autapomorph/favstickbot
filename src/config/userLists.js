const splitUserIdsString = require('../utils/common/splitUserIdsString');

const { OWNER_LIST, ADMIN_LIST, DEV_MODE_ALLOW_LIST } = process.env;

const ownerList = splitUserIdsString(OWNER_LIST);
const ownerSet = new Set(ownerList);

const adminList = splitUserIdsString(ADMIN_LIST);
const adminSet = new Set(adminList);

const devModeAllowedList = splitUserIdsString(DEV_MODE_ALLOW_LIST);
const devModeAllowedSet = new Set(devModeAllowedList);

module.exports = {
  ownerList,
  ownerSet,
  adminList,
  adminSet,
  devModeAllowedList,
  devModeAllowedSet,
};
