const connect = require('../src/utils/migrations/connect');

const { roles } = require('../src/config/roles');

module.exports.description = 'User: set `role` if not defined';

module.exports.up = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({ role: undefined }, { $set: { role: roles.user } });
  await client.close();
};

module.exports.down = next => next();
