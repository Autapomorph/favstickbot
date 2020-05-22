const logger = require('./logger');

const errorBoundary = fn => {
  return async (ctx, next) => {
    try {
      return await fn(ctx);
    } catch (error) {
      logger.error('Error boundary caught an unhandled error:\n%O\nContext:\n%O', error, ctx);
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

      return next();
    }
  };
};

module.exports = errorBoundary;
