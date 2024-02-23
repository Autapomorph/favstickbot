import { connect } from './connect.js';

export const description = 'Add description here';

export const up = async () => {
  const client = await connect();
  await client.close();
};

export const down = async () => {
  const client = await connect();
  await client.close();
};
