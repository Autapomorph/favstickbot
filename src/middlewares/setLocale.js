module.exports = async (ctx, next) => {
  ctx.i18n.locale(ctx.session.user.settings.locale);
  return next();
};
