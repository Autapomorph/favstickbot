const Scene = require('telegraf/scenes/base');

const packsTypeScene = require('./steps/type');
const packsTitleScene = require('./steps/title');
const packsNameScene = require('./steps/name');
const packsCopyScene = require('./steps/copy');

const packsCreateScene = new Scene('PACKS_CREATE');

packsCreateScene.enter(async ctx => {
  const { state } = ctx.scene;

  if (!state.packToCreate) {
    state.packToCreate = {};
  }

  return ctx.scene.enter('PACKS_CREATE/TYPE', state);
});

module.exports = [
  packsCreateScene,
  packsTypeScene,
  packsTitleScene,
  packsNameScene,
  packsCopyScene,
];
