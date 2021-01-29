const Session = require('../../models/Session');

module.exports = async key => {
  const session = await Session.updateOrCreate(key);
  return session.data || {};
};
