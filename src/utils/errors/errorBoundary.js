const TelegramError = require('telegraf/core/network/error');

const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const ERROR_SETS = require('./sets');
const validateError = require('./validateErrorType');
const logger = require('../logger');

module.exports = async (error, ctx) => {
  const {
    state: { user: { id, username, firstName, lastName, settings, selectedPack } = {} } = {},
    scene: { state: sceneState } = {},
    session,
    match,
    update,
    updateType,
    updateSubTypes,
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
    updateSubTypes,
    sceneState,
    session,
  });

  if (error instanceof TelegramError) {
    if (validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      return;
    }

    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
