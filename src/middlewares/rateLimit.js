const rateLimit = require('telegraf-ratelimit');

const { replyErrorRatelimit } = require('../utils/errors/replyError');

const limitConfig = {
  window: 300,
  limit: 1,
  onLimitExceeded: ctx => replyErrorRatelimit(ctx),
};

module.exports = rateLimit(limitConfig);
