const { drop, passThru } = require('telegraf').Composer;

const { devModeAllowedSet } = require('../config/userLists');
const { isDev } = require('../utils');

module.exports =
  isDev && devModeAllowedSet.size ? drop(ctx => !devModeAllowedSet.has(ctx.from?.id)) : passThru();
