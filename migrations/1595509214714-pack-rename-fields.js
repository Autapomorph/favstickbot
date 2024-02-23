import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Pack: rename `owner`';

export const up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { owner: 'userId' } });
  await client.close();
};

export const down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { userId: 'owner' } });
  await client.close();
};
