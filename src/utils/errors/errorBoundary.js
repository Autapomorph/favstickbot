const { TelegramError } = require('telegraf');
const { Error: MongooseError } = require('mongoose');

const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const ERROR_SETS = require('./sets');
const validateError = require('./validateErrorType');
const logger = require('../logger');

module.exports = async (error, ctx) => {
  if (error instanceof MongooseError || error.message.includes('ECONNREFUSED')) {
    logger.error(error);
    return;
  }

  const {
    state: { user: { id, username, firstName, lastName, settings, selectedPack } = {} } = {},
    scene: { state: sceneState } = {},
    session,
    match,
    update,
    updateType,
  } = ctx;

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    user: { id, username, firstName, lastName, settings, selectedPack },
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
