import { Session } from '../../models/Session.js';

export const getSession = async key => {
  const session = await Session.updateOrCreate(key);
  return session.data ?? {};
};
