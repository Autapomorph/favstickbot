const rolesList = ['user', 'admin', 'superAdmin', 'owner'];

const roles = rolesList.reduce((acc, role) => {
  acc[role] = role;
  return acc;
}, {});

const rolesEnum = rolesList.reduce((acc, role, i) => {
  const idx = i + 1;
  acc[role] = idx;
  acc[idx] = role;
  return acc;
}, {});

module.exports = {
  roles,
  rolesList,
  rolesEnum,
};
