/* eslint-disable no-await-in-loop */
import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Session: make `data.user` as ref to User model';

export const up = async () => {
  const client = await connect();
  const sessions = client.db().collection('sessions');
  await sessions.updateMany({ 'data.user._id': { $ne: null } }, [
    { $set: { 'data.user': '$data.user._id' } },
  ]);
  await client.close();
};

export const down = async () => {
  const client = await connect();

  const sessions = client.db().collection('sessions');
  const users = client.db().collection('users');

  const oldSessions = await sessions.find({ 'data.user': { $ne: null } }).toArray();

  for (let index = 0; index < oldSessions.length; index += 1) {
    const user = await users.findOne({ _id: oldSessions[index].data.user });
    if (user) {
      await sessions.updateOne({ 'data.user': user._id }, { $set: { 'data.user': user } });
    }
  }

  await client.close();
};
