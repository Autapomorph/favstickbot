const Scene = require('telegraf/scenes/base');
const { match } = require('telegraf-i18n');

const PACK_TYPES = require('../../../../utils/packs/packTypes');
const { validatePackType } = require('../helpers/validators');
const { replyPackType } = require('../replies');

const packsCreateTypeScene = new Scene('PACKS/CREATE/TYPE');

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

packsCreateTypeScene.on('message', async ctx => {
  return ctx.scene.reenter();
});

module.exports = packsCreateTypeScene;
