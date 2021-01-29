const Session = require('../../models/Session');

module.exports = async key => {
  return Session.deleteOne({ _id: key });
};
