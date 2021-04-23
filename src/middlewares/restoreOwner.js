const roles = require('../config/roles');
const { ownerSet } = require('../config/userLists');

module.exports = async (ctx, next) => {
  const { user } = ctx.state;
  if (user.role !== roles.owner && ownerSet.has(user._id)) {
    user.role = roles.owner;
    await user.save();
  }

  return next();
};
