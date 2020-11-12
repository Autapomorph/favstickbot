const connect = require('../src/utils/migrations/connect');

module.exports.description = 'Pack: rename `isHidden`';

module.exports.up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { isHidden: 'isArchived' } });
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { isArchived: 'isHidden' } });
  await client.close();
};
