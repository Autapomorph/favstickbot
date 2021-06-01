const connect = require('../src/utils/migrations/connect');

module.exports.description =
  'Sticker: rename `pack`, `original.fileId`, `original.fileType`. Drop `emojis`, `original.fileUniqueId`, `original.packName` and `updatedAt`';

module.exports.up = async () => {
  const client = await connect();
  const stickers = client.db().collection('stickers');
  await stickers.dropIndex({ fileUniqueId: 1 });
  await stickers.updateMany(
    {},
    {
      $rename: {
        pack: 'packId',
        fileUniqueId: 'uid',
        'original.fileId': 'original.id',
        'original.fileType': 'original.type',
      },
      $unset: { emojis: '', 'original.fileUniqueId': '', 'original.packName': '', updatedAt: '' },
    },
  );
  await stickers.createIndex('uid');
  await client.close();
};

module.exports.down = async () => {
  const client = await connect();
  const stickers = client.db().collection('stickers');
  await stickers.dropIndex({ uid: 1 });
  await stickers.updateMany(
    {},
    {
      $rename: { packId: 'pack', uid: 'fileUniqueId', 'original.type': 'original.fileType' },
      $set: { updatedAt: new Date() },
    },
  );
  await stickers.createIndex('fileUniqueId');
  await client.close();
};
