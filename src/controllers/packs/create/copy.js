const Scene = require('telegraf/scenes/base');

const { copyPack } = require('./helpers');

const packsCreateCopyScene = new Scene('PACKS_CREATE/COPY');

packsCreateCopyScene.enter(async ctx => {
  const { user } = ctx.session;
  const { packToCopy } = ctx.scene.state;
  return copyPack(ctx, packToCopy, user.selectedPack);
});

// prevent bot from listening commands while copying stickers
packsCreateCopyScene.on('text', () => {});

module.exports = packsCreateCopyScene;
