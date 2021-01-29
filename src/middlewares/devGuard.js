const { drop, passThru } = require('telegraf').Composer;

const splitUserIdsString = require('../utils/common/splitUserIdsString');
const { isDev } = require('../utils');

const { DEV_MODE_ALLOW_LIST } = process.env;

const allowedUsers = splitUserIdsString(DEV_MODE_ALLOW_LIST);

module.exports =
  isDev && allowedUsers.length
    ? drop(ctx => !ctx.from || !allowedUsers.includes(ctx.from.id))
    : passThru();
