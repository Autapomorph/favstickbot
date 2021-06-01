const connect = require('../src/utils/migrations/connect');

module.exports.description = 'User: drop null fields';

module.exports.up = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({}, [
    {
      $replaceWith: {
        $arrayToObject: {
          $filter: {
            input: { $objectToArray: '$$ROOT' },
            cond: { $ne: ['$$this.v', null] },
          },
        },
      },
    },
  ]);
  await client.close();
};

module.exports.down = next => next();
