const { drop, passThru } = require('telegraf').Composer;

const { devModeAllowedList } = require('../config/userLists');
const { isDev } = require('../utils');

module.exports =
  isDev && devModeAllowedList.length
    ? drop(ctx => !devModeAllowedList.includes(ctx.from?.id))
    : passThru();
