const Scene = require('telegraf/scenes/base');

const { createPack, validatePackName } = require('../helpers');
const { replyPackName } = require('../replies');

const packsCreateNameScene = new Scene('PACKS_CREATE/NAME');

packsCreateNameScene.enter(async ctx => {
  return replyPackName(ctx);
});

packsCreateNameScene.on('text', async ctx => {
  const { user } = ctx.session;
  const { packToCreate, packToCopy } = ctx.scene.state;
  const packName = ctx.message.text;
  packToCreate.name = `${packName}_by_${ctx.botInfo.username}`;

  if (!(await validatePackName(ctx, packToCreate.name))) {
    return ctx.scene.reenter();
  }

  try {
    await createPack(ctx, user, packToCreate, packToCopy);
  } catch (error) {
    return;
  }

  if (packToCopy) {
    return ctx.scene.enter('PACKS_CREATE/COPY', ctx.scene.state);
  }

  return ctx.scene.leave();
});

module.exports = packsCreateNameScene;
