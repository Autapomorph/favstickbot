/* eslint-disable no-await-in-loop */
import { ObjectId } from 'mongodb';

import { connect } from '../src/utils/migrations/connect.js';

export const description = 'User: set `telegramId` as `_id`';

export const up = async () => {
  const client = await connect();

  const users = client.db().collection('users');
  const packs = client.db().collection('packs');

  await users.dropIndexes();

  const oldUsers = await users.find().toArray();
  const newUsers = oldUsers.map(oldUser => {
    const newUser = {
      ...oldUser,
      _id: oldUser.telegramId,
    };
    delete newUser.telegramId;
    return newUser;
  });

  for (let index = 0; index < oldUsers.length; index += 1) {
    const oldUser = oldUsers[index];
    const newUser = newUsers[index];
    await packs.updateMany({ userId: oldUser._id }, { $set: { userId: newUser._id } });
  }

  await users.deleteMany();
  await users.insertMany(newUsers);

  await client.close();
};

export const down = async () => {
  const client = await connect();

  const users = client.db().collection('users');
  const packs = client.db().collection('packs');

  await users.dropIndexes();

  const oldUsers = await users.find().toArray();
  const newUsers = oldUsers.map(oldUser => {
    return {
      ...oldUser,
      _id: new ObjectId(),
      telegramId: oldUser._id,
    };
  });

  for (let index = 0; index < newUsers.length; index += 1) {
    const oldUser = oldUsers[index];
    const newUser = newUsers[index];
    await packs.updateMany({ userId: oldUser._id }, { $set: { userId: newUser._id } });
  }

  await users.deleteMany();
  await users.insertMany(newUsers);

  await users.createIndex('telegramId', { unique: true });

  await client.close();
};
