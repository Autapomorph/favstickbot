const Session = require('../../models/Session');
const getSessionKey = require('./getKey');

const deleteSceneData = async ctx => {
  return Session.findByIdAndUpdate(getSessionKey(ctx), {
    $unset: { 'data.__scenes': '' },
  });
};

module.exports = deleteSceneData;
