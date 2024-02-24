import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

import { validatePackTitle } from '../helpers/validators.js';
import { replyPackTitle } from '../replies.js';

export const packsCreateTitleScene = new Scenes.BaseScene('PACKS/CREATE/TITLE');

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
