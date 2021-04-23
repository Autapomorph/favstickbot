const { defineAbilityFor } = require('../config/ability');

module.exports = async (ctx, next) => {
  ctx.state.ability = defineAbilityFor(ctx.state.user);
  return next();
};
