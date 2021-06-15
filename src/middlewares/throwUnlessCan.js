const { ForbiddenError } = require('@casl/ability');

module.exports =
  (...canArgs) =>
  (ctx, next) => {
    ForbiddenError.from(ctx.state.ability).throwUnlessCan(...canArgs);
    return next();
  };
