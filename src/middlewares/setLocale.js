module.exports = async (ctx, next) => {
  ctx.i18n.locale(ctx.state.user.settings.locale);
  return next();
};
