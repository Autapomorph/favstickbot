import { User } from '../models/User.js';

export const getUser = async (ctx, next) => {
  if (ctx.from) {
    ctx.state.user = await User.updateOrCreate(ctx.from);
    return next();
  }
};
