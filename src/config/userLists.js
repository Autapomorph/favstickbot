import { splitUserIdsString } from '../utils/common/splitUserIdsString.js';

const { OWNER_LIST, DEV_MODE_ALLOW_LIST } = process.env;

export const ownerList = splitUserIdsString(OWNER_LIST);
export const ownerSet = new Set(ownerList);

export const devModeAllowedList = splitUserIdsString(DEV_MODE_ALLOW_LIST);
export const devModeAllowedSet = new Set(devModeAllowedList);
