const { session } = require('telegraf');

const getSessionKey = require('../utils/sessions/getKey');
const getSession = require('../utils/sessions/get');
const saveSession = require('../utils/sessions/save');
const deleteSession = require('../utils/sessions/delete');

module.exports = session({
  getSessionKey,
  store: {
    get: getSession,
    set: saveSession,
    delete: deleteSession,
  },
});
