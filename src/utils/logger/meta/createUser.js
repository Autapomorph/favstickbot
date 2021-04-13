const createUser = ctx => {
  const user = ctx.state?.user ?? {};
  const { id, username, firstName, lastName, settings, selectedPack, ban, left } = user;
  return {
    id,
    username,
    firstName,
    lastName,
    settings,
    selectedPack,
    ban,
    left,
  };
};

module.exports = createUser;
