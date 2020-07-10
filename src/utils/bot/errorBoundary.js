const logger = require('../logger');
const { replyErrorTelegram, replyErrorUnknown } = require('../errors/replyError');

module.exports = async (error, ctx) => {
  const {
    session: {
      user: { id, telegramId, firstName, lastName, username, locale, selectedPack } = {},
    } = {},
    scene: { state: sceneState } = {},
    match,
    update,
    updateType,
    updateSubTypes,
  } = ctx;

  logger.error(error, {
    description: 'Bot caught an unexpected exception:',
    user: { id, telegramId, firstName, lastName, username, locale, selectedPack },
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
    // Forbidden: bot was blocked by the user
    if (/forbidden.*bot.*blocked.*user/i.test(error.description)) {
      return;
    }

    // Too Many Requests: retry after *
    if (/too.*many.*requests/i.test(error.description)) {
      return;
    }

    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
