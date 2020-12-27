const Session = require('../../models/Session');

const saveSession = async (key, data) => {
  if (data === null || data === undefined || Object.keys(data).length === 0) {
    return Session.deleteOne({ _id: key });
  }

  return Session.updateOrCreate(key, data);
};

module.exports = saveSession;
