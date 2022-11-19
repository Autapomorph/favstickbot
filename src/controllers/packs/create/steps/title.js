const { Scenes } = require('telegraf');
const { message } = require('telegraf/filters');

const { validatePackTitle } = require('../helpers/validators');
const { replyPackTitle } = require('../replies');

const packsCreateTitleScene = new Scenes.BaseScene('PACKS/CREATE/TITLE');

packsCreateTitleScene.enter(async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;

  if (typeof packToCreate.title === 'string') {
    return ctx.scene.enter('PACKS/CREATE/NAME', state);
  }

  return replyPackTitle(ctx);
});

packsCreateTitleScene.on(message('text'), async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;
  const packTitle = ctx.message.text;

  packToCreate.title = packTitle;

  if (!(await validatePackTitle(ctx, packTitle))) {
    return ctx.scene.reenter();
  }

  return ctx.scene.enter('PACKS/CREATE/NAME', state);
});

packsCreateTitleScene.on(message(), async ctx => {
  return ctx.scene.reenter();
});

module.exports = packsCreateTitleScene;
