import { Composer } from 'telegraf';

import { User } from '../models/User.js';

export const banGuard = async (ctx, next) => {
  const userId = ctx.from?.id;
  const user = await User.findById(userId).select('ban');
  return user?.ban ? Composer.drop(true) : next();
};
