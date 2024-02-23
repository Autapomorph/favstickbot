import { connect } from '../src/utils/migrations/connect.js';

export const description = 'User: restructure settings';

export const up = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({}, [
    { $set: { settings: { locale: '$locale', showArchivedPacks: '$showArchivedPacks' } } },
    { $unset: ['locale', 'showArchivedPacks'] },
  ]);
  await client.close();
};

export const down = async () => {
  const client = await connect();
  const users = client.db().collection('users');
  await users.updateMany({}, [
    { $set: { locale: '$settings.locale', showArchivedPacks: '$settings.showArchivedPacks' } },
    { $unset: ['settings'] },
  ]);
  await client.close();
};
