import { connect } from '../src/utils/migrations/connect.js';

export const description = 'Pack: drop `hasTgInstance`';

export const up = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $unset: { hasTgInstance: '' } });
  await client.close();
};

export const down = async () => {
  const client = await connect();
  const packs = client.db().collection('packs');
  await packs.updateMany({}, { $set: { hasTgInstance: true } });
  await client.close();
};
