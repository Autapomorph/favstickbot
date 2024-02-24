export const rolesList = ['user', 'admin', 'superAdmin', 'owner'];

export const roles = rolesList.reduce((acc, role) => {
  acc[role] = role;
  return acc;
}, {});

export const rolesEnum = rolesList.reduce((acc, role, i) => {
  const idx = i + 1;
  acc[role] = idx;
  acc[idx] = role;
  return acc;
}, {});
