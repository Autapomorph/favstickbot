const { TelegramError } = require('telegraf');
const { Error: MongooseError } = require('mongoose');

const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const validateError = require('./validateErrorType');
const ERROR_TYPES = require('./types');
const ERROR_SETS = require('./sets');
const logger = require('../logger');
const createMeta = require('../logger/meta/createMeta');

module.exports = async (error, ctx) => {
  if (error instanceof MongooseError || error.message.includes('ECONNREFUSED')) {
    logger.error(error);
    return;
  }

  // Do not log or reply if blocked by user
  if (validateError(ERROR_TYPES.TELEGRAM.BLOCKED_BY_USER, error)) {
    return;
  }

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    tags: { unexpected: true },
    ...createMeta(ctx),
  });

  if (error instanceof TelegramError) {
    if (validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      return;
    }

    return replyErrorTelegram(ctx, error).catch(e => logger.error(e, createMeta(ctx)));
  }

  return replyErrorUnknown(ctx).catch(e => logger.error(e, createMeta(ctx)));
};
