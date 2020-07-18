const telegram = require('../telegram');

module.exports = async (ctx, next) => {
  if (!ctx.me || !ctx.botInfo) {
    const botInfo = await telegram.getMe();
    ctx.options.username = botInfo.username;
    ctx.botInfo = botInfo;
  }

  return next();
};
