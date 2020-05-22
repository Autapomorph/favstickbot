const { replySuccess, replyErrorRestore } = require('./helpers');
const { getHiddenPackByName, getVisiblePacks } = require('../../../utils/packs');

const enter = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('cmd.restore.reply'));
};

const command = async ctx => {
  const { user } = ctx.session;
  const { packName } = ctx.state;

  const packToRestore = await getHiddenPackByName(user.id, packName);
  if (!packToRestore) {
    return replyErrorRestore(ctx);
  }

  const visiblePacks = await getVisiblePacks(user.id);
  if (!visiblePacks.length) {
    // set pack to be selected one if there are no visible packs
    user.selectedPack = packToRestore;
    await user.save();
  }

  // mark pack as visible
  packToRestore.isHidden = false;
  await packToRestore.save();

  return replySuccess(ctx, packToRestore);
};

module.exports = {
  enter,
  command,
};
