const Scene = require('telegraf/scenes/base');

const packsTypeScene = require('./steps/type');
const packsTitleScene = require('./steps/title');
const packsNameScene = require('./steps/name');
const packsCopyScene = require('./steps/copy');

const packsCreateScene = new Scene('PACKS_CREATE');

packsCreateScene.enter(async ctx => {
  const defaultPackToCreate = {
    isAnimated: false,
    title: '',
    name: '',
  };

  ctx.scene.state.packToCreate = defaultPackToCreate;
  const { packToCreate, packToCopy } = ctx.scene.state;

  if (packToCopy) {
    packToCreate.isAnimated = packToCopy.isAnimated;
    return ctx.scene.enter('PACKS_CREATE/TITLE', ctx.scene.state);
  }

  return ctx.scene.enter('PACKS_CREATE/TYPE', ctx.scene.state);
});

module.exports = [
  packsCreateScene,
  packsTypeScene,
  packsTitleScene,
  packsNameScene,
  packsCopyScene,
];
