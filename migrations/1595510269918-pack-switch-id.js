/* eslint-disable no-await-in-loop */
import { ObjectId } from 'mongodb';

import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Pack: set `name` as `_id`';

export const up = async () => {
  const client = await connect();

  const packs = client.db().collection('packs');
  const stickers = client.db().collection('stickers');
  const users = client.db().collection('users');

  await packs.dropIndexes();

  const oldPacks = await packs.find().toArray();
  const newPacks = oldPacks.map(oldPack => {
    const newPack = {
      ...oldPack,
      _id: oldPack.name,
    };
    delete newPack.name;
    return newPack;
  });

  for (let index = 0; index < oldPacks.length; index += 1) {
    const oldPack = oldPacks[index];
    const newPack = newPacks[index];
    await stickers.updateMany({ packId: oldPack._id }, { $set: { packId: newPack._id } });
    await users.updateOne(
      { _id: newPack.userId, selectedPack: oldPack._id },
      { $set: { selectedPack: newPack._id } },
    );
  }

  await packs.deleteMany();
  await packs.insertMany(newPacks);

  await client.close();
};

export const down = async () => {
  const client = await connect();

  const packs = client.db().collection('packs');
  const stickers = client.db().collection('stickers');
  const users = client.db().collection('users');

  await packs.dropIndexes();

  const oldPacks = await packs.find().toArray();
  const newPacks = oldPacks.map(oldPack => {
    return {
      ...oldPack,
      _id: new ObjectId(),
      name: oldPack._id,
    };
  });

  for (let index = 0; index < oldPacks.length; index += 1) {
    const oldPack = oldPacks[index];
    const newPack = newPacks[index];
    await stickers.updateMany({ packId: oldPack._id }, { $set: { packId: newPack._id } });
    await users.updateOne(
      { _id: newPack.userId, selectedPack: oldPack._id },
      { $set: { selectedPack: newPack._id } },
    );
  }

  await packs.deleteMany();
  await packs.insertMany(newPacks);

  await packs.createIndex('name', { unique: true });

  await client.close();
};
