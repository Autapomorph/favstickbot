const faker = require('faker');
const roles = require('../../../src/config/roles');
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

const ownerIds = Array.from({ length: 2 }, (_, i) => -1 * (1000 + i));
const owners = ownerIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.owner,
    username: `${roles.owner}-${i + 1}`,
  };
});

const superAdminIds = Array.from({ length: 2 }, (_, i) => -1 * (2000 + i));
const superAdmins = superAdminIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.superAdmin,
    username: `${roles.superAdmin}-${i + 1}`,
  };
});

const adminIds = Array.from({ length: 2 }, (_, i) => -1 * (3000 + i));
const admins = adminIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.admin,
    username: `${roles.admin}-${i + 1}`,
  };
});

const regularUserIds = Array.from({ length: 10 }, (_, i) => -1 * (4000 + i));
const regularUsers = regularUserIds.map((id, i) => {
  return {
    ...getDefaultUser(),
    _id: id,
    role: roles.user,
    username: `${roles.user}-${i + 1}`,
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
