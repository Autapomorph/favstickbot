import { ObjectId } from 'mongodb';

import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Sticker: set `fileId` as `_id`';

export const up = async () => {
  const client = await connect();

  const stickers = client.db().collection('stickers');

  await stickers.dropIndexes();

  const oldStickers = await stickers.find().toArray();
  const newStickers = oldStickers.map(oldSticker => {
    const newSticker = {
      ...oldSticker,
      _id: oldSticker.fileId,
    };
    delete newSticker.fileId;
    return newSticker;
  });

  await stickers.deleteMany();
  await stickers.insertMany(newStickers);

  await stickers.createIndex('uid', { unique: true });

  await client.close();
};

export const down = async () => {
  const client = await connect();

  const stickers = client.db().collection('stickers');

  await stickers.dropIndexes();

  const oldStickers = await stickers.find().toArray();
  const newStickers = oldStickers.map(oldSticker => {
    return {
      ...oldSticker,
      _id: new ObjectId(),
      fileId: oldSticker._id,
    };
  });

  await stickers.deleteMany();
  await stickers.insertMany(newStickers);

  await stickers.createIndex('fileId', { unique: true });
  await stickers.createIndex('uid', { unique: true });

  await client.close();
};
