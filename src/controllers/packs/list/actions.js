const Pack = require('../../../models/Pack');
const escapeHTML = require('../../../utils/common/escapeHTML');
const ERROR_TYPES = require('../../../utils/errors/types');
const { replyErrorToMessage } = require('../../../utils/errors/reply');

// Mark pack as selected
const selectPack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToSelect = await Pack.findById(packId);

  if (ctx.state.ability.cannot('update', packToSelect)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.ACCESS_DENIED);
  }

  packToSelect.isArchived = false;
  await packToSelect.save();
  user.selectedPack = packToSelect;
  await user.save();

  return ctx.answerCbQuery(
    ctx.i18n.t('operation.pack.select.answer', {
      title: escapeHTML(user.selectedPack.title),
    }),
  );
};

// Archive pack
const archivePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToModify = await Pack.findById(packId);

  if (ctx.state.ability.cannot('update', packToModify)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.ACCESS_DENIED);
  }

  packToModify.isArchived = true;
  await packToModify.save();

  // If pack is selected
  if (packToModify.id === user.selectedPack?.id) {
    // Get first visible pack and make it selected (if exists, null otherwise)
    user.selectedPack = await Pack.findOne().byUser(user.id).byIsArchived(false);

    // Delete field `selectedPack` if no visible packs exist
    if (user.selectedPack === null) {
      user.selectedPack = undefined;
    }

    await user.save();
  }

  return ctx.answerCbQuery(
    ctx.i18n.t('operation.pack.archive.answer', {
      title: escapeHTML(packToModify.title),
    }),
  );
};

// Restore pack from archive
const restorePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToModify = await Pack.findById(packId);
  const visiblePacksCount = await Pack.find().byUser(user.id).byIsArchived(false).countDocuments();

  if (ctx.state.ability.cannot('update', packToModify)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.ACCESS_DENIED);
  }

  // Set pack to be selected one if there are no visible packs
  if (visiblePacksCount <= 0) {
    user.selectedPack = packToModify;
    await user.save();
  }

  packToModify.isArchived = false;
  await packToModify.save();

  return ctx.answerCbQuery(
    ctx.i18n.t('operation.pack.restore.answer', {
      title: escapeHTML(packToModify.title),
    }),
  );
};

// Delete pack
const deletePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToDelete = await Pack.findById(packId);

  if (ctx.state.ability.cannot('delete', packToDelete)) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.ACCESS_DENIED);
  }

  await packToDelete.deleteOne();

  // If pack is selected
  if (packToDelete.id === user.selectedPack?.id) {
    // Get first visible pack and make it selected (if exists, null otherwise)
    user.selectedPack = await Pack.findOne().byUser(user.id).byIsArchived(false);

    // Delete field `selectedPack` if no visible packs exist
    if (user.selectedPack === null) {
      user.selectedPack = undefined;
    }

    await user.save();
  }

  return ctx.answerCbQuery(
    ctx.i18n.t('operation.pack.delete.answer', {
      title: escapeHTML(packToDelete.title),
    }),
  );
};

module.exports = {
  select: selectPack,
  archive: archivePack,
  restore: restorePack,
  delete: deletePack,
};
