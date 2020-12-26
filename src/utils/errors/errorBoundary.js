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
    if (
      validateError(
        [
          ERROR_TYPES.TELEGRAM.TOO_MANY_REQUESTS,
          ERROR_TYPES.TELEGRAM.BLOCKED_BY_USER,
          ERROR_TYPES.TELEGRAM.KICKED_FROM_GROUP,
          ERROR_TYPES.TELEGRAM.KICKED_FROM_SUPERGROUP,
          ERROR_TYPES.TELEGRAM.KICKED_FROM_CHANNEL,
          ERROR_TYPES.TELEGRAM.USER_DEACTIVATED,
          ERROR_TYPES.TELEGRAM.NOT_GROUP_MEMBER,
          ERROR_TYPES.TELEGRAM.NOT_SUPERGROUP_MEMBER,
          ERROR_TYPES.TELEGRAM.NOT_CHANNEL_MEMBER,
        ],
        error,
      )
    ) {
      return;
    }

    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
