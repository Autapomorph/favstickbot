const logger = require('../logger');

module.exports = async (error, ctx) => {
  logger.error(`Bot caught an unhandled error:\n%O\nContext:\n%O`, error, ctx);
  logger.sentry.error(error);

  if (error.description) {
    await ctx.reply(
      ctx.i18n.t('shared.error.reply.telegram', {
        error: error.description,
      }),
    );
  } else {
    await ctx.reply(ctx.i18n.t('shared.error.reply.uncaughtException'));
  }
};
