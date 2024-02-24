import { limit } from '@grammyjs/ratelimiter';

import * as ERROR_TYPES from '../utils/errors/types/index.js';
import { replyError } from '../utils/errors/reply.js';

export const rateLimit = limit({
  onLimitExceeded: async ctx => {
    return replyError(ctx, ERROR_TYPES.APP.RATELIMIT);
  },
});
