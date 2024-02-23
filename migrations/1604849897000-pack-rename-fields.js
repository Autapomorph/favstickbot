import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Pack: rename `isHidden`';

export const up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { isHidden: 'isArchived' } });
  await client.close();
};

export const down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $rename: { isArchived: 'isHidden' } });
  await client.close();
};
