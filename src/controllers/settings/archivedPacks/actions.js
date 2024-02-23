export const setShowArchivedPacks = async (ctx, showArchivedPacks) => {
  const { user } = ctx.state;
  user.settings.showArchivedPacks = showArchivedPacks;
  await user.save();
};
