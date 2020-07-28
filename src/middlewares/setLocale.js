module.exports = async (ctx, next) => {
  ctx.i18n.locale(ctx.session.user.locale);
  return next();
};
