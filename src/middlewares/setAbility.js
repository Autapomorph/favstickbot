import { defineAbilityFor } from '../config/ability.js';

export const setAbility = async (ctx, next) => {
  ctx.state.ability = defineAbilityFor(ctx.state.user);
  return next();
};
