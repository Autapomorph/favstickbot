const Scene = require('telegraf/scenes/base');

const packsTypeScene = require('./type');
const packsTitleScene = require('./title');
const packsNameScene = require('./name');
const packsCopyScene = require('./copy');

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
    packToCreate.isAnimated = packToCopy.is_animated || false;
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
