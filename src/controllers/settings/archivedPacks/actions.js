const setShowArchivedPacks = async (ctx, showArchivedPacks) => {
  const { user } = ctx.session;
  user.settings.showArchivedPacks = showArchivedPacks;
  await user.save();
};

module.exports = {
  setShowArchivedPacks,
};
