import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

import { PACK_TYPES } from '../../../../utils/packs/packTypes.js';
import { validatePackType } from '../helpers/validators.js';
import { replyPackType } from '../replies.js';
import { match } from '../../../../utils/i18n/match.js';

export const packsCreateTypeScene = new Scenes.BaseScene('PACKS/CREATE/TYPE');

packsCreateTypeScene.enter(async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;

  if (typeof packToCreate.isAnimated === 'boolean') {
    return ctx.scene.enter('PACKS/CREATE/TITLE', state);
  }

  return replyPackType(ctx);
});

packsCreateTypeScene.hears([match(PACK_TYPES.STATIC), match(PACK_TYPES.ANIMATED)], async ctx => {
  const { state } = ctx.scene;
  const { packToCreate } = state;
  const packType = ctx.message.text;

  if (!(await validatePackType(ctx, packType))) {
    return ctx.scene.reenter();
  }

  packToCreate.isAnimated = Boolean(match(PACK_TYPES.ANIMATED)(packType, ctx));
  return ctx.scene.enter('PACKS/CREATE/TITLE', state);
});

packsCreateTypeScene.on(message(), async ctx => {
  return ctx.scene.reenter();
});
