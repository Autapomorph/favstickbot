const { TelegramError } = require('telegraf');
const { Error: MongooseError } = require('mongoose');

const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const ERROR_TYPES = require('./types');
const ERROR_SETS = require('./sets');
const validateError = require('./validateErrorType');
const logger = require('../logger');

module.exports = async (error, ctx) => {
  if (error instanceof MongooseError || error.message.includes('ECONNREFUSED')) {
    logger.error(error);
    return;
  }

  // Do not log or reply if blocked by user
  if (validateError(ERROR_TYPES.TELEGRAM.BLOCKED_BY_USER, error)) {
    return;
  }

  const user = ctx.state?.user ?? {};
  const { id, username, firstName, lastName, settings, selectedPack, ban, left } = user;
  const sceneState = ctx.scene?.state;
  const { session, match, update, updateType } = ctx;

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    user: { id, username, firstName, lastName, settings, selectedPack, ban, left },
    tags: {
      unexpected: true,
    },
    match,
    update,
    updateType,
    sceneState,
    session,
  });

  if (error instanceof TelegramError) {
    if (validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      return;
    }

    return replyErrorTelegram(ctx, error).catch(logger.error);
  }

  return replyErrorUnknown(ctx).catch(logger.error);
};
