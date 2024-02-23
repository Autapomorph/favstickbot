import { roles } from '../config/roles.js';
import { ownerSet } from '../config/userLists.js';

export const restoreOwner = async (ctx, next) => {
  const { user } = ctx.state;
  if (user.role !== roles.owner && ownerSet.has(user._id.toNumber())) {
    user.role = roles.owner;
    await user.save();
  }

  return next();
};
