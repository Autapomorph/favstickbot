import { Composer } from 'telegraf';

import { devModeAllowedSet } from '../config/userLists.js';
import { isDev } from '../utils/index.js';

export const devGuard =
  isDev && devModeAllowedSet.size
    ? Composer.drop(ctx => !devModeAllowedSet.has(ctx.from?.id))
    : Composer.passThru();
