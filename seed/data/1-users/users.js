const faker = require('faker');
const { roles, rolesEnum } = require('../../../src/config/roles');
const { ownerList, ownerSet, devModeAllowedList } = require('../../../src/config/userLists');

const getDefaultUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    selectedPack: null,
    role: roles.user,
    settings: {
      locale: 'en',
      showArchivedPacks: false,
    },
    ban: false,
    left: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const createNegativeIdForIdx = (role, idx) => -1 * (role * 1000 + idx + 1);
const createUsernameForIdx = (role, idx) => `${role}-${idx + 1}`;

const predefinedOwnerIds = ownerList;
const predefinedOwners = predefinedOwnerIds.map(id => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.owner,
    username: `predefined-${roles.owner}-${id}`,
  };
});

const devModeAllowedIds = devModeAllowedList.filter(id => !ownerSet.has(id));
const devModeAllowedOwners = devModeAllowedIds.map(id => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.owner,
    username: `devmode-${roles.owner}-${id}`,
  };
});

const ownerIds = Array.from({ length: 2 }, (_, i) => createNegativeIdForIdx(rolesEnum.owner, i));
const owners = ownerIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.owner,
    username: createUsernameForIdx(roles.owner, i),
  };
});

const superAdminIds = Array.from({ length: 2 }, (_, i) =>
  createNegativeIdForIdx(rolesEnum.superAdmin, i),
);
const superAdmins = superAdminIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.superAdmin,
    username: createUsernameForIdx(roles.superAdmin, i),
  };
});

const adminIds = Array.from({ length: 2 }, (_, i) => createNegativeIdForIdx(rolesEnum.admin, i));
const admins = adminIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.admin,
    username: createUsernameForIdx(roles.admin, i),
  };
});

const regularUserIds = Array.from({ length: 10 }, (_, i) =>
  createNegativeIdForIdx(rolesEnum.user, i),
);
const regularUsers = regularUserIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.user,
    username: createUsernameForIdx(roles.user, i),
  };
});

const users = [
  ...predefinedOwners,
  ...devModeAllowedOwners,
  ...owners,
  ...superAdmins,
  ...admins,
  ...regularUsers,
];

module.exports = users;
