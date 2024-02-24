import { Session } from '../../models/Session.js';

export const deleteSession = async key => {
  return Session.deleteOne({ _id: key });
};
