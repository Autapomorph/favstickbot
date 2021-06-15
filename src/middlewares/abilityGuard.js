const { acl } = require('telegraf').Composer;

const abilityGuard =
  can =>
  (...args) =>
  (...fns) =>
    acl(ctx => ctx.state.ability[can ? 'can' : 'cannot'](...args), ...fns);

module.exports = {
  can: abilityGuard(true),
  cannot: abilityGuard(false),
};
