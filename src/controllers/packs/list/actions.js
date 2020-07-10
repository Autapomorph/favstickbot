const {
  replyPackSelectAction,
  replyPackHideAction,
  replyPackRestoreAction,
  replyErrorAccessDenied,
} = require('./helpers');
const {
  getPackById,
  getVisiblePack,
  getVisiblePacks,
  getSelectedPackId,
} = require('../../../utils/packs');
const { validateOwner } = require('../../../utils/packs/validate');

// Mark pack as selected
const selectPack = async ctx => {
  const { user } = ctx.session;
  const packToSelect = await getPackById(ctx.match.groups.packId);

  if (!validateOwner(packToSelect, user)) {
    return replyErrorAccessDenied(ctx);
  }

  packToSelect.isHidden = false;
  await packToSelect.save();
  user.selectedPack = packToSelect;
  await user.save();

  return replyPackSelectAction(ctx, packToSelect);
};

// Hide pack from pack list
const hidePack = async ctx => {
  const { user } = ctx.session;
  const packToModify = await getPackById(ctx.match.groups.packId);
  const selectedPackId = getSelectedPackId(user);

  if (!validateOwner(packToModify, user)) {
    return replyErrorAccessDenied(ctx);
  }

  packToModify.isHidden = true;
  await packToModify.save();

  // If pack is selected
  if (String(packToModify.id) === String(selectedPackId)) {
    // Get first visible pack and make it selected (if exists, null otherwise)
    user.selectedPack = await getVisiblePack(user.id);
    await user.save();
  }

  return replyPackHideAction(ctx, packToModify);
};

// Restore pack to pack list
const restorePack = async ctx => {
  const { user } = ctx.session;
  const packToModify = await getPackById(ctx.match.groups.packId);
  const visiblePacks = await getVisiblePacks(user.id);

  if (!validateOwner(packToModify, user)) {
    return replyErrorAccessDenied(ctx);
  }

  // Set pack to be selected one if there are no visible packs
  if (!visiblePacks.length) {
    user.selectedPack = packToModify;
    await user.save();
  }

  packToModify.isHidden = false;
  await packToModify.save();

  return replyPackRestoreAction(ctx, packToModify);
};

module.exports = {
  select: selectPack,
  hide: hidePack,
  restore: restorePack,
};
