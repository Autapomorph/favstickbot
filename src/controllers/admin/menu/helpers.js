import { ForbiddenError } from '@casl/ability';

export const getMenuBody = ctx => {
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('access', 'AdminMode');
  return ctx.i18n.t('menu.admin.body');
};
