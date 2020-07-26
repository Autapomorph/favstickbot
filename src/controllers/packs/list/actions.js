const Pack = require('../../../models/Pack');
const {
  replyPackSelectAction,
  replyPackHideAction,
  replyPackRestoreAction,
  replyErrorAccessDenied,
} = require('./replies');
const getSelectedPackId = require('../../../utils/packs/getSelectedPackId');
const { validateOwner } = require('../../../utils/packs/validate');

// Mark pack as selected
const selectPack = async ctx => {
  const { user } = ctx.session;
  const packToSelect = await Pack.findById(ctx.match.groups.packId);

  if (!validateOwner(packToSelect.userId, user.id)) {
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
  const packToModify = await Pack.findById(ctx.match.groups.packId);
  const selectedPackId = getSelectedPackId(user);

  if (!validateOwner(packToModify.userId, user.id)) {
    return replyErrorAccessDenied(ctx);
  }

  packToModify.isHidden = true;
  await packToModify.save();

  // If pack is selected
  if (String(packToModify.id) === String(selectedPackId)) {
    // Get first visible pack and make it selected (if exists, null otherwise)
    user.selectedPack = await Pack.findOneVisible(user.id);

    // Delete field `selectedPack` if no visible packs exist
    if (user.selectedPack === null) {
      user.selectedPack = undefined;
    }

    await user.save();
  }

  return replyPackHideAction(ctx, packToModify);
};

// Restore pack to pack list
const restorePack = async ctx => {
  const { user } = ctx.session;
  const packToModify = await Pack.findById(ctx.match.groups.packId);
  const visiblePacks = await Pack.findVisible(user.id);

  if (!validateOwner(packToModify.userId, user.id)) {
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
