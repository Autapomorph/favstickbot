const Scene = require('telegraf/scenes/base');
const { drop } = require('telegraf/composer');

const Session = require('../../../models/Session');
const copyPack = require('./helpers/copyPack');
const getSessionKey = require('../../../utils/sessions/getKey');

const packsCopyScene = new Scene('PACKS/COPY');

const getIsAborted = async sessionKey => {
  const session = await Session.findById(sessionKey);
  /* eslint-disable no-underscore-dangle */
  if (!session || !session.data || !session.data.__scenes) return true;
  return session.data.__scenes.current !== 'PACKS/COPY';
  /* eslint-enable no-underscore-dangle */
};

packsCopyScene.enter(async ctx => {
  const { user } = ctx.state;
  const { packToCopy } = ctx.scene.state;
  const sessionKey = getSessionKey(ctx);
  await Session.findByIdAndUpdate(sessionKey, {
    'data.__scenes.current': 'PACKS/COPY',
  });
  return copyPack(ctx, packToCopy, user.selectedPack, getIsAborted.bind(null, sessionKey));
});

// Drop any updates
packsCopyScene.use(drop(true));

// Delete data from session after leave
packsCopyScene.leave(async ctx => {
  const sessionKey = getSessionKey(ctx);
  return Session.findByIdAndUpdate(sessionKey, {
    $unset: { 'data.__scenes': '' },
  });
});

module.exports = packsCopyScene;
