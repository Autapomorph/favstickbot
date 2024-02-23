import { Composer } from 'telegraf';

const abilityGuard =
  can =>
  (...args) =>
  (...fns) =>
    Composer.acl(ctx => ctx.state.ability[can ? 'can' : 'cannot'](...args), ...fns);

export const can = abilityGuard(true);

export const cannot = abilityGuard(false);
