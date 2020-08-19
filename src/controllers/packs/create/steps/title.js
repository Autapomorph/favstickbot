const Scene = require('telegraf/scenes/base');

const { validatePackTitle } = require('../helpers/validators');
const { replyPackTitle } = require('../replies');

const packsCreateTitleScene = new Scene('PACKS_CREATE/TITLE');

packsCreateTitleScene.enter(async ctx => {
  return replyPackTitle(ctx);
});

packsCreateTitleScene.on('text', async ctx => {
  const { packToCreate } = ctx.scene.state;
  const packTitle = ctx.message.text;
  packToCreate.title = packTitle;

  if (!(await validatePackTitle(ctx, packTitle))) {
    return ctx.scene.reenter();
  }

  return ctx.scene.enter('PACKS_CREATE/NAME', ctx.scene.state);
});

module.exports = packsCreateTitleScene;
