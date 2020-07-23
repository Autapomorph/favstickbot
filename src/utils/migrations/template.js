// eslint-disable-next-line import/no-unresolved
const connect = require('../src/utils/migrations/connect');

module.exports.description = 'Add description here';

module.exports.up = async () => {
  const client = await connect();
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  await client.close();
};
