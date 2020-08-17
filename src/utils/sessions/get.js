const Session = require('../../models/Session');

const getSession = async key => {
  const session = await Session.updateOrCreate(key);
  return session.data || {};
};

module.exports = getSession;
