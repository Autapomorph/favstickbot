const TelegramError = require('telegraf/core/network/error');

const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const ERROR_TYPES = require('./errorTypes');
const validateError = require('./validateErrorType');
const logger = require('../logger');

module.exports = async (error, ctx) => {
  const {
    session: { user: { id, username, firstName, lastName, settings, selectedPack } = {} } = {},
    scene: { state: sceneState } = {},
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
  });

  if (error instanceof TelegramError) {
    const { TOO_MANY_REQUESTS, BLOCKED_BY_USER } = ERROR_TYPES.TELEGRAM;

    if (validateError([TOO_MANY_REQUESTS, BLOCKED_BY_USER], error)) {
      return;
    }

    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
