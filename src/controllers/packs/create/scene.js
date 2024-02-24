import { Scenes } from 'telegraf';

import { packsCreateTypeScene } from './steps/type.js';
import { packsCreateTitleScene } from './steps/title.js';
import { packsCreateNameScene } from './steps/name.js';

const packCreateScene = new Scenes.BaseScene('PACKS/CREATE');

packCreateScene.enter(async ctx => {
  const { state } = ctx.scene;

  if (!state.packToCreate) {
    state.packToCreate = {};
  }

  return ctx.scene.enter('PACKS/CREATE/TYPE', state);
});

export { packCreateScene as base };

export const packCreateScenes = {
  base: packCreateScene,
  type: packsCreateTypeScene,
  title: packsCreateTitleScene,
  name: packsCreateNameScene,
};
