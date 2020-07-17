const { telegrafThrottler } = require('telegraf-throttler');
const Bottleneck = require('bottleneck').default;

const { replyErrorRatelimit } = require('../utils/errors/replyError');
const logger = require('../utils/logger');

module.exports = telegrafThrottler({
  in: {
    maxConcurrent: 1,
    minTime: 333,
    highWater: 10,
    strategy: Bottleneck.strategy.OVERFLOW,
  },
  out: {
    minTime: 25,
    reservoir: 30,
    reservoirRefreshAmount: 30,
    reservoirRefreshInterval: 1 * 1000,
  },
  group: {
    maxConcurrent: 1,
    minTime: 333,
    reservoir: 20,
    reservoirRefreshAmount: 20,
    reservoirRefreshInterval: 60 * 1000,
  },
  onThrottlerError: async (ctx, next, throttlerName, error) => {
    if (error instanceof Bottleneck.BottleneckError) {
      logger.warn(`${throttlerName} | ${error.message}`);

      // Reply only for incoming requests
      if (/inbound/i.test(throttlerName)) {
        return replyErrorRatelimit(ctx);
      }
    }

    throw error;
  },
});
