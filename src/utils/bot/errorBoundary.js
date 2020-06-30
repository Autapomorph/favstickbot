const logger = require('../logger');
const { replyErrorTelegram, replyErrorUnknown } = require('../errors/replyError');

module.exports = async (error, ctx) => {
  const {
    session: {
      user: { id, telegramId, firstName, lastName, username, locale, selectedPack },
    },
    scene: { state: sceneState },
    match,
    update,
    updateType,
    updateSubTypes,
  } = ctx;

  logger.error(error, {
    description: 'Bot caught an unhandled exception:',
    user: { id, telegramId, firstName, lastName, username, locale, selectedPack },
    match,
    update,
    updateType,
    updateSubTypes,
    sceneState,
  });

  if (error.description) {
    return replyErrorTelegram(ctx, error);
  }

  return replyErrorUnknown(ctx);
};
