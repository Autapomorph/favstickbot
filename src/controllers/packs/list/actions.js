import { subject } from '@casl/ability';

import { Pack } from '../../../models/Pack.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import { replyErrorToMessage } from '../../../utils/errors/reply.js';

// Mark pack as selected
export const selectPack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToSelect = await Pack.findById(packId);

  if (ctx.state.ability.cannot('update', subject('Pack', packToSelect.toObject()))) {
    return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.ACCESS_DENIED);
  }

  packToSelect.isArchived = false;
  await packToSelect.save();
  user.selectedPack = packToSelect;
  await user.save();

  return ctx.answerCbQuery(
    ctx.i18n.t('operation.pack.select.answer', {
      title: user.selectedPack.title,
    }),
  );
};

// Archive pack
export const archivePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToModify = await Pack.findById(packId);

  if (ctx.state.ability.cannot('update', subject('Pack', packToModify.toObject()))) {
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
      title: packToModify.title,
    }),
  );
};

// Restore pack from archive
export const restorePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToModify = await Pack.findById(packId);
  const visiblePacksCount = await Pack.find().byUser(user.id).byIsArchived(false).countDocuments();

  if (ctx.state.ability.cannot('update', subject('Pack', packToModify.toObject()))) {
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
      title: packToModify.title,
    }),
  );
};

// Delete pack
export const deletePack = async (ctx, packId) => {
  const { user } = ctx.state;
  const packToDelete = await Pack.findById(packId);

  if (ctx.state.ability.cannot('delete', subject('Pack', packToDelete.toObject()))) {
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
      title: packToDelete.title,
    }),
  );
};
