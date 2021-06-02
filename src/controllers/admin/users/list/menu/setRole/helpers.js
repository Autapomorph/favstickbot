const { ForbiddenError, subject } = require('@casl/ability');
const { capitalCase } = require('change-case');

const User = require('../../../../../../models/User');
const { roles, rolesList, rolesEnum } = require('../../../../../../config/roles');

const getMenuBody = async ctx => {
  return ctx.i18n.t('menu.admin.users.user.set_role.body', {
    user: ctx.match[2],
  });
};

const getMenuChoices = async ctx => {
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

module.exports = {
  getMenuBody,
  getMenuChoices,
};
