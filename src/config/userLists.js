const splitUserIdsString = require('../utils/common/splitUserIdsString');

const { DEV_MODE_ALLOW_LIST, ADMIN_LIST } = process.env;

const adminList = splitUserIdsString(ADMIN_LIST);
const devModeAllowedList = splitUserIdsString(DEV_MODE_ALLOW_LIST);

module.exports = {
  adminList,
  devModeAllowedList,
};
