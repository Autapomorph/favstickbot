/* eslint-disable no-underscore-dangle */
const { ObjectID } = require('mongodb');

const connect = require('../src/utils/migrations/connect');

module.exports.description = 'Set `fileId` as `_id`';

module.exports.up = async () => {
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

module.exports.down = async () => {
  const client = await connect();

  const stickers = client.db().collection('stickers');

  await stickers.dropIndexes();

  const oldStickers = await stickers.find().toArray();
  const newStickers = oldStickers.map(oldSticker => {
    return {
      ...oldSticker,
      _id: new ObjectID(),
      fileId: oldSticker._id,
    };
  });

  await stickers.deleteMany();
  await stickers.insertMany(newStickers);

  await stickers.createIndex('fileId', { unique: true });
  await stickers.createIndex('uid', { unique: true });

  await client.close();
};
