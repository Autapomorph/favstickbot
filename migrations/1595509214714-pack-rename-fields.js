// eslint-disable-next-line import/no-unresolved
const connect = require('../src/utils/migrations/connect');

module.exports.description = 'Pack: rename `owner`';

module.exports.up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { owner: 'userId' } });
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { userId: 'owner' } });
  await client.close();
};
