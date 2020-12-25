const { drop, passThru } = require('telegraf/composer');

const { isDev } = require('../utils');

const { DEV_MODE_ALLOW_LIST } = process.env;

const allowedUsers = DEV_MODE_ALLOW_LIST
  ? DEV_MODE_ALLOW_LIST.split(',').map(Number).filter(Boolean)
  : [];

module.exports =
  isDev && allowedUsers.length
    ? drop(ctx => !ctx.from || !allowedUsers.includes(ctx.from.id))
    : passThru();
