const {
  replyPackSelectAction,
  replyPackHideRestoreAction,
  replyErrorAccessDenied,
} = require('./helpers');
const {
  getPackById,
  getVisiblePack,
  getVisiblePacks,
  getSelectedPackId,
} = require('../../../utils/packs');

// mark pack as selected
const selectPack = async ctx => {
  const { user } = ctx.session;
  const packToSelect = await getPackById(ctx.match.groups.packId);

  if (String(packToSelect.owner) !== String(user.id)) {
    return replyErrorAccessDenied(ctx);
  }

  packToSelect.isHidden = false;
  await packToSelect.save();
  user.selectedPack = packToSelect;
  await user.save();

  return replyPackSelectAction(ctx, packToSelect);
};

// hide/restore packs to be visible in packlist
const hideOrRestorePack = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await getVisiblePacks(user.id);
  const packToModify = await getPackById(ctx.match.groups.packId);
  const selectedPackId = getSelectedPackId(user);
  const isRestoring = packToModify.isHidden;
  const isHiding = !isRestoring;

  if (String(packToModify.owner) !== String(user.id)) {
    return replyErrorAccessDenied(ctx);
  }

  // hide pack
  if (isHiding) {
    packToModify.isHidden = true;
    await packToModify.save();

    // if pack is selected
    if (String(packToModify.id) === String(selectedPackId)) {
      // get first visible pack and make it selected (if exists, null otherwise)
      user.selectedPack = await getVisiblePack(user.id);
      await user.save();
    }
  }

  // restore pack
  if (isRestoring) {
    if (!visiblePacks.length) {
      // set pack to be selected one if there are no visible packs
      user.selectedPack = packToModify;
      await user.save();
    }

    packToModify.isHidden = false;
    await packToModify.save();
  }

  return replyPackHideRestoreAction(ctx, packToModify);
};

module.exports = {
  select: selectPack,
  hide: hideOrRestorePack,
};
