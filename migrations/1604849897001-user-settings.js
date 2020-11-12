const connect = require('../src/utils/migrations/connect');

module.exports.description = 'User: restructure settings';

module.exports.up = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({}, [
    { $set: { settings: { locale: '$locale', showArchivedPacks: '$showArchivedPacks' } } },
    { $unset: ['locale', 'showArchivedPacks'] },
  ]);
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({}, [
    { $set: { locale: '$settings.locale', showArchivedPacks: '$settings.showArchivedPacks' } },
    { $unset: ['settings'] },
  ]);
  await client.close();
};
