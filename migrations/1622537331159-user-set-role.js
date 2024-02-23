import { connect } from '../src/utils/migrations/connect.js';
import { roles } from '../src/config/roles.js';

export const description = 'User: set `role` if not defined';

export const up = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({ role: undefined }, { $set: { role: roles.user } });
  await client.close();
};

export const down = next => next();
