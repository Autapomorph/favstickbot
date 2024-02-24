import { telegrafThrottler } from 'telegraf-throttler';
import Bottleneck from 'bottleneck';

import * as ERROR_TYPES from '../utils/errors/types/index.js';
import { replyError } from '../utils/errors/reply.js';
import { logger } from '../utils/logger/index.js';

export const throttle = telegrafThrottler({
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
