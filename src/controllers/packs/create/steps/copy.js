const Scene = require('telegraf/scenes/base');
const { drop } = require('telegraf/composer');

const { copyPack } = require('../helpers');

const packsCreateCopyScene = new Scene('PACKS_CREATE/COPY');

packsCreateCopyScene.enter(async ctx => {
  const { user } = ctx.session;
  const { packToCopy } = ctx.scene.state;
  return copyPack(ctx, packToCopy, user.selectedPack);
});

// Drop any updates
packsCreateCopyScene.use(drop(true));

module.exports = packsCreateCopyScene;
