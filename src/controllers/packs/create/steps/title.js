const Scene = require('telegraf/scenes/base');

const { validatePackTitle } = require('../helpers/validators');
const { replyPackTitle } = require('../replies');

const packsCreateTitleScene = new Scene('PACKS/CREATE/TITLE');

packsCreateTitleScene.enter(async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;

  if (typeof packToCreate.title === 'string') {
    return ctx.scene.enter('PACKS/CREATE/NAME', state);
  }

  return replyPackTitle(ctx);
});

packsCreateTitleScene.on('text', async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;
  const packTitle = ctx.message.text;

  packToCreate.title = packTitle;

  if (!(await validatePackTitle(ctx, packTitle))) {
    return ctx.scene.reenter();
  }

  return ctx.scene.enter('PACKS/CREATE/NAME', state);
});

module.exports = packsCreateTitleScene;
