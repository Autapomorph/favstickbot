const { replyErrorTelegram, replyErrorUnknown } = require('./reply');
const ERROR_TYPES = require('./errorTypes');
const validateError = require('./validateRegexErrorType');
const logger = require('../logger');

module.exports = async (error, ctx) => {
  const {
    session: { user: { id, username, firstName, lastName, locale, selectedPack } = {} } = {},
    scene: { state: sceneState } = {},
    match,
    update,
    updateType,
    updateSubTypes,
  } = ctx;

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    user: { id, username, firstName, lastName, locale, selectedPack },
    tags: {
      unexpected: true,
    },
    match,
    update,
    updateType,
    updateSubTypes,
    sceneState,
  });

  // Error sent from Telegram
  if (error.description) {
    const { TOO_MANY_REQUESTS, BLOCKED_BY_USER } = ERROR_TYPES.TELEGRAM;

    if (validateError(TOO_MANY_REQUESTS, error)) {
      return;
    }

    if (validateError(BLOCKED_BY_USER, error)) {
      return;
    }

    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
