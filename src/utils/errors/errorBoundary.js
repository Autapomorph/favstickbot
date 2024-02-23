import { TelegramError } from 'telegraf';
import { MongooseError } from 'mongoose';
import { ForbiddenError } from '@casl/ability';

import { replyErrorTelegram, replyErrorForbidden, replyErrorUnknown } from './reply.js';
import { answerErrorForbidden } from './answer.js';
import { validateTelegramErrorType } from './validateErrorType.js';
import * as ERROR_TYPES from './types/index.js';
import * as ERROR_SETS from './sets/index.js';
import { logger } from '../logger/index.js';
import { createMeta } from '../logger/meta/createMeta.js';

export const errorBoundary = (error, ctx) => {
  if (error instanceof MongooseError || error.message.includes('ECONNREFUSED')) {
    logger.error(error);
    return;
  }

  // Do not log or reply if blocked by user
  if (validateTelegramErrorType(ERROR_TYPES.TELEGRAM.BLOCKED_BY_USER, error)) {
    return;
  }

  if (error instanceof ForbiddenError) {
    if (ctx.callbackQuery) {
      return answerErrorForbidden(ctx).catch(e => logger.error(e, createMeta(ctx)));
    }
    return replyErrorForbidden(ctx).catch(e => logger.error(e, createMeta(ctx)));
  }

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    tags: { unexpected: true },
    ...createMeta(ctx),
  });

  if (error instanceof TelegramError) {
    if (validateTelegramErrorType(ERROR_SETS.DO_NOT_REPLY, error)) {
      return;
    }

    return replyErrorTelegram(ctx, error).catch(e => logger.error(e, createMeta(ctx)));
  }

  return replyErrorUnknown(ctx).catch(e => logger.error(e, createMeta(ctx)));
};
