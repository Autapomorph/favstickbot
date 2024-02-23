import { connect } from '../src/utils/migrations/connect.js';

export const description = 'User: drop null fields';

export const up = async () => {
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

export const down = next => next();
