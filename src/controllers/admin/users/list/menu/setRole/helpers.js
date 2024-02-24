import { ForbiddenError, subject } from '@casl/ability';
import { capitalCase } from 'change-case';

import { User } from '../../../../../../models/User.js';
import { roles, rolesList, rolesEnum } from '../../../../../../config/roles.js';

export const getMenuBody = async ctx => {
  return ctx.i18n.t('menu.admin.users.user.set_role.body', {
    user: ctx.match[2],
  });
};

export const getMenuChoices = async ctx => {
  const userToModify = await User.findById(ctx.match[2]);
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', userToModify);

  return rolesList.reduce((acc, role) => {
    if (ctx.state.ability.can('read', subject('User', { role: roles[role] }))) {
      const capitalazedRole = capitalCase(role);
      acc[rolesEnum[role]] = userToModify.role === role ? `☑️ ${capitalazedRole}` : capitalazedRole;
    }
    return acc;
  }, {});
};
