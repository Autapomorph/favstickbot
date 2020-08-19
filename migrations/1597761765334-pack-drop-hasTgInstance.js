const connect = require('../src/utils/migrations/connect');

module.exports.description = 'Drop `hasTgInstance`';

module.exports.up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $unset: { hasTgInstance: '' } });
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $set: { hasTgInstance: true } });
  await client.close();
};
