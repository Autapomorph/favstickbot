/* eslint-disable no-restricted-syntax */
import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Session: make `data.user` as _id';

export const up = async () => {
  const client = await connect();
  const sessions = client.db().collection('sessions');

  for await (const session of sessions.find()) {
    const oldId = session._id;
    session._id = session.data.user;
    delete session.data.user;
    await sessions.deleteOne({ _id: oldId });
    await sessions.insertOne(session);
  }

  await client.close();
};

export const down = async () => {
  const client = await connect();
  const sessions = client.db().collection('sessions');

  for await (const session of sessions.find()) {
    const oldId = session._id;
    session._id = `${oldId}:${oldId}`;
    session.data.user = oldId;
    await sessions.deleteOne({ _id: oldId });
    await sessions.insertOne(session);
  }

  await client.close();
};
