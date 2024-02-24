import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

import { createPack } from '../helpers/createPack.js';
import { getMainKeyboard } from '../../../../keyboards/main.js';
import { getCancelKeyboard } from '../../../../keyboards/cancel.js';
import { validatePackName } from '../helpers/validators.js';
import { replyPackName } from '../replies.js';

export const packsCreateNameScene = new Scenes.BaseScene('PACKS/CREATE/NAME');

packsCreateNameScene.enter(async ctx => {
  return replyPackName(ctx);
});

packsCreateNameScene.on(message('text'), async ctx => {
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

packsCreateNameScene.on(message(), async ctx => {
  return ctx.scene.reenter();
});
