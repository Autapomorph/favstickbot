const logger = require('../logger');
const { replyErrorTelegram, replyErrorUncaught } = require('../errors/replyError');

module.exports = async (error, ctx) => {
  logger.error('Bot caught an unhandled error:', error);

  if (error.description) {
    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUncaught(ctx);
};
