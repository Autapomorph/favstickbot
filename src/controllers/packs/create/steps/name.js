const Scene = require('telegraf/scenes/base');

const createPack = require('../helpers/createPack');
const getMainKeyboard = require('../../../../keyboards/main');
const getCancelKeyboard = require('../../../../keyboards/cancel');
const { validatePackName } = require('../helpers/validators');
const { replyPackName } = require('../replies');

const packsCreateNameScene = new Scene('PACKS/CREATE/NAME');

packsCreateNameScene.enter(async ctx => {
  return replyPackName(ctx);
});

packsCreateNameScene.on('text', async ctx => {
  const { user } = ctx.state;
  const { state } = ctx.scene;
  const { packToCreate, nextScene } = state;
  const packName = ctx.message.text;
  packToCreate.name = `${packName}_by_${ctx.botInfo.username}`;

  if (!(await validatePackName(ctx, packToCreate.name))) {
    return ctx.scene.reenter();
  }

  try {
    const keyboard = nextScene ? getCancelKeyboard(ctx) : getMainKeyboard(ctx);
    await createPack(ctx, user, packToCreate, keyboard);
  } catch (error) {
    return;
  }

  if (nextScene) {
    return ctx.scene.enter(nextScene, state);
  }

  return ctx.scene.leave();
});

module.exports = packsCreateNameScene;
