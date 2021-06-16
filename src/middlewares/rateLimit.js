const { limit } = require('@grammyjs/ratelimiter/out/rateLimiter');

const ERROR_TYPES = require('../utils/errors/types');
const { replyError } = require('../utils/errors/reply');

module.exports = limit({
  onLimitExceeded: async ctx => {
    return replyError(ctx, ERROR_TYPES.APP.RATELIMIT);
  },
});
