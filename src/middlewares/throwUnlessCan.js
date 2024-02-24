import { ForbiddenError } from '@casl/ability';

export const throwUnlessCan =
  (...canArgs) =>
  (ctx, next) => {
    ForbiddenError.from(ctx.state.ability).throwUnlessCan(...canArgs);
    return next();
  };
