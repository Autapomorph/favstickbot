const { drop } = require('telegraf').Composer;

const User = require('../models/User');

module.exports = async (ctx, next) => {
  const userId = ctx.from?.id;
  const user = await User.findById(userId).select('ban');
  return user?.ban ? drop(true) : next();
};
