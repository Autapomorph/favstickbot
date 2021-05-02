const { Ability, AbilityBuilder } = require('@casl/ability');

const roles = require('./roles');

const defineUserRules = (user, { can }) => {
  can('delete', 'User', { id: user.id });
  can(['update', 'delete'], 'Pack', { userId: user.id });
};

const defineAdminRules = (user, { can, cannot }) => {
  can('access', 'AdminMode');
  can('update', 'User', ['ban'], { role: roles.user });
  cannot('update', 'User', ['ban'], { id: user.id });
};

const defineSuperAdminRules = (user, { can, cannot }) => {
  can('read', 'Stats');
  can('update', 'User', ['ban'], { role: roles.admin });
  can('update', 'User', ['role'], {
    role: { $in: [roles.user, roles.admin] },
  });
  cannot('update', 'User', ['ban', 'role'], { id: user.id });
};

const defineOwnerRules = (user, { can, cannot }) => {
  can('read', 'User');
  can('update', 'User', ['ban', 'role'], { role: roles.superAdmin });
  cannot('update', 'User', ['ban', 'role'], { id: user.id });
};

const defineAbilityFor = user => {
  const builder = new AbilityBuilder(Ability);

  switch (user.role) {
    case roles.owner:
      defineUserRules(user, builder);
      defineAdminRules(user, builder);
      defineSuperAdminRules(user, builder);
      defineOwnerRules(user, builder);
      break;
    case roles.superAdmin:
      defineUserRules(user, builder);
      defineAdminRules(user, builder);
      defineSuperAdminRules(user, builder);
      break;
    case roles.admin:
      defineUserRules(user, builder);
      defineAdminRules(user, builder);
      break;
    case roles.user:
    default:
      defineUserRules(user, builder);
      break;
  }

  return builder.build();
};

module.exports = { defineAbilityFor };
