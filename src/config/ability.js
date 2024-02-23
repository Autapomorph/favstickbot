import { AbilityBuilder, createMongoAbility } from '@casl/ability';

import { roles } from './roles.js';

const defineUserRules = (user, { can }) => {
  can('delete', 'User', { id: user.id });
  can(['update', 'delete'], 'Pack', { userId: user.id });
};

const defineAdminRules = (user, { can, cannot }) => {
  can('access', 'AdminMode');
  can('read', 'User', { role: roles.user });
  can('update', 'User', ['ban'], { role: roles.user });
  cannot('update', 'User', ['ban'], { id: user.id });
};

const defineSuperAdminRules = (user, { can, cannot }) => {
  can('read', 'Stats');
  can('read', 'User', { role: roles.admin });
  can('update', 'User', ['ban'], { role: roles.admin });
  can('update', 'User', ['role'], {
    role: { $in: [roles.user, roles.admin] },
  });
  cannot('update', 'User', ['ban', 'role'], { id: user.id });
};

const defineOwnerRules = (user, { can, cannot }) => {
  can('read', 'User');
  can('update', 'User');
  cannot('update', 'User', ['ban', 'role'], { role: roles.owner });
  cannot('update', 'User', ['ban', 'role'], { id: user.id });
};

export const defineAbilityFor = user => {
  const builder = new AbilityBuilder(createMongoAbility);

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
