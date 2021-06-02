const { ForbiddenError, subject } = require('@casl/ability');
const { capitalCase } = require('change-case');

const User = require('../../../../../models/User');
const { roles, rolesList, rolesEnum } = require('../../../../../config/roles');

const filterUsersByRole = (users, role) =>
  users.filter(user => {
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  });

const getMenuBody = async ctx => {
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', 'User');

  const users = await User.find().select('role');

  const replyText = `${ctx.i18n.t(`menu.admin.users.body`)}:\n`;
  return rolesList.reduce((acc, roleKey) => {
    const role = roles[roleKey];
    const usersByRole = filterUsersByRole(users, role);
    return `${acc}\n${capitalCase(roleKey)}: ${usersByRole.length}`;
  }, replyText);
};

const getMenuChoices = async ctx => {
  return rolesList.reduce((acc, role) => {
    if (ctx.state.ability.can('read', subject('User', { role: roles[role] }))) {
      acc[rolesEnum[role]] = capitalCase(role);
    }
    return acc;
  }, {});
};

module.exports = {
  getMenuBody,
  getMenuChoices,
};
