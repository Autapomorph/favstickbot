import { createUser } from './createUser.js';
import { createContexts } from './createContexts.js';

export const createMeta = ctx => {
  return {
    user: createUser(ctx),
    contexts: createContexts(ctx),
  };
};
