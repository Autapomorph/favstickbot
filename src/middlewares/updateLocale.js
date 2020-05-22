module.exports = async (ctx, next) => {
  const { user } = ctx.session;

  if (!user.locale) {
    user.locale = ctx.i18n.locale();
    await user.save();
  } else {
    ctx.i18n.locale(user.locale);
  }

  return next();
};
