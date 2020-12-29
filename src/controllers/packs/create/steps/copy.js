const Scene = require('telegraf/scenes/base');
const { drop } = require('telegraf/composer');

const copyPack = require('../helpers/copyPack');
const getSessionKey = require('../../../../utils/sessions/getKey');
const deleteSceneData = require('../../../../utils/sessions/deleteSceneData');

const packsCreateCopyScene = new Scene('PACKS_CREATE/COPY');

const sceneSession = new Map();

const checkAborted = ctx => !sceneSession.has(getSessionKey(ctx));

packsCreateCopyScene.enter(async ctx => {
  const { user } = ctx.state;
  const { packToCopy } = ctx.scene.state;
  sceneSession.set(getSessionKey(ctx), '');
  return copyPack(ctx, packToCopy, user.selectedPack, checkAborted.bind(null, ctx));
});

// Drop any updates
packsCreateCopyScene.use(drop(true));

// Delete testScene data from session after leave
packsCreateCopyScene.leave(async ctx => {
  sceneSession.delete(getSessionKey(ctx));
  return deleteSceneData(ctx);
});

module.exports = packsCreateCopyScene;
