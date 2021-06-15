const { telegrafThrottler } = require('telegraf-throttler');
const Bottleneck = require('bottleneck').default;

const ERROR_TYPES = require('../utils/errors/types');
const { replyError } = require('../utils/errors/reply');
const logger = require('../utils/logger');

module.exports = telegrafThrottler({
  in: {
    maxConcurrent: 1,
    minTime: 333,
    highWater: 3,
    strategy: Bottleneck.strategy.LEAK,
  },
  out: {
    minTime: 25,
    reservoir: 30,
    reservoirRefreshAmount: 30,
    reservoirRefreshInterval: 1 * 1000,
  },
  group: {
    maxConcurrent: 1,
    minTime: 1000,
    reservoir: 20,
    reservoirRefreshAmount: 20,
    reservoirRefreshInterval: 60 * 1000,
  },
  inThrottlerError: async (ctx, next, error) => {
    logger.warn(error.message);
    return replyError(ctx, ERROR_TYPES.APP.RATELIMIT);
  },
});
