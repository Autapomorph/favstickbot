const Scene = require('telegraf/scenes/base');
const { match } = require('telegraf-i18n');

const PACK_TYPES = require('../../../../utils/packs/packTypes');
const { validatePackType } = require('../helpers');
const { replyPackType } = require('../replies');

const packsCreateTypeScene = new Scene('PACKS_CREATE/TYPE');

packsCreateTypeScene.enter(async ctx => {
  return replyPackType(ctx);
});

packsCreateTypeScene.hears([match(PACK_TYPES.NORMAL), match(PACK_TYPES.ANIMATED)], async ctx => {
  const packType = ctx.message.text;
  const { packToCreate } = ctx.scene.state;

  if (!(await validatePackType(ctx, packType))) {
    return ctx.scene.reenter();
  }

  packToCreate.isAnimated = Boolean(match(PACK_TYPES.ANIMATED)(packType, ctx));
  return ctx.scene.enter('PACKS_CREATE/TITLE', ctx.scene.state);
});

packsCreateTypeScene.on('message', async ctx => {
  return ctx.scene.reenter();
});

module.exports = packsCreateTypeScene;
