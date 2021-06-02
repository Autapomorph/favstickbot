const users = require('../1-users/users');
const { roles } = require('../../../src/config/roles');

const packIdPostfix = `_by_${process.env.DB_SEED_BOT_USERNAME}`;

const getDefaultPack = user => {
  return {
    userId: user._id,
    title: 'pack',
    isAnimated: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const totalOwners = users.filter(user => user.role === roles.owner);
const predefinedOwners = totalOwners.filter(user => user.username.includes('predefined'));
const devModeAllowedOwners = totalOwners.filter(user => user.username.includes('devmode'));

const packs = [];

[...predefinedOwners, ...devModeAllowedOwners].forEach(user => {
  const userPackIds = Array.from({ length: 5 }, (_, idx) => idx + 1);

  userPackIds.forEach((id, idx) => {
    const userId = String(user._id).replace('-', 'minus_');
    const isAnimated = idx === 1 || idx === 4;
    const isArchived = idx === 3 || idx === 4;
    const title = isAnimated ? 'anim' : 'static';

    const pack = {
      ...getDefaultPack(user),
      _id: `u_${userId}_${id}${packIdPostfix}`,
      title: `${title}-${idx + 1}`,
      isAnimated,
      isArchived,
    };

    packs.push(pack);
  });
});

module.exports = packs;
