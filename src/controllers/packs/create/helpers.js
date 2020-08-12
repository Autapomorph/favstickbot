const Extra = require('telegraf/extra');
const { match } = require('telegraf-i18n');

const replies = require('./replies');
const Pack = require('../../../models/Pack');
const getCancelKeyboard = require('../../../keyboards/cancel');
const getMainKeyboard = require('../../../keyboards/main');
const { replyProgress, editProgress, replySuccess } = require('../copy/replies');
const copyPackHelper = require('../../../utils/packs/copy');
const createPackTg = require('../../../utils/packs/create');
const { validateNameLength, validateNameSymbols } = require('../../../utils/packs/validate');
const { replyErrorTelegram } = require('../../../utils/errors/reply');
const PACK_TYPES = require('../../../utils/packs/packTypes');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const validateError = require('../../../utils/errors/validateRegexErrorType');
const logger = require('../../../utils/logger');

const createPack = async (ctx, user, packToCreate, nextOperation) => {
  try {
    await createPackTg(ctx, packToCreate);

    // eslint-disable-next-line no-param-reassign
    user.selectedPack = await Pack.create({
      userId: user.id,
      name: packToCreate.name,
      title: packToCreate.title,
      isAnimated: packToCreate.isAnimated,
      hasTgInstance: true,
    });
    await user.save();

    if (nextOperation) {
      return await replies.replySuccess(ctx, user.selectedPack, getCancelKeyboard(ctx));
    }

    return await replies.replySuccess(ctx, user.selectedPack);
  } catch (error) {
    const { STICKERSET_INVALID_NAME, STICKERSET_NAME_OCCUPIED } = ERROR_TYPES.TELEGRAM;

    if (validateError(STICKERSET_INVALID_NAME, error)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameInvalid(ctx);
      ctx.scene.reenter();
      throw error;
    }

    if (validateError(STICKERSET_NAME_OCCUPIED, error)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameOccupied(ctx);
      ctx.scene.reenter();
      throw error;
    }

    logger.error(error);

    await replyErrorTelegram(
      ctx,
      error,
      Extra.markup(getMainKeyboard(ctx)).inReplyTo(ctx.message.message_id),
    );
    ctx.scene.leave();
    throw error;
  }
};

const copyStickerByOne = async (copyPackGen, ctx, successCallback) => {
  if (!ctx.scene.state.packToCopy) {
    return ctx.scene.leave();
  }

  if (!(await copyPackGen.next()).done) {
    return copyStickerByOne(copyPackGen, ctx, successCallback);
  }

  await successCallback();
  return ctx.scene.leave();
};

const copyPack = async (ctx, packToCopy, newPack) => {
  try {
    const message = await replyProgress(ctx, packToCopy, newPack);
    const copyPackGen = copyPackHelper(
      ctx,
      packToCopy,
      editProgress.bind(null, ctx, packToCopy, newPack, message),
    );
    const successCallback = () =>
      replySuccess(ctx, message, packToCopy, newPack, getMainKeyboard(ctx).extra());

    copyStickerByOne(copyPackGen, ctx, successCallback);
  } catch (error) {
    logger.error(error);
    await replyErrorTelegram(ctx, error, getMainKeyboard(ctx).extra());
    return ctx.scene.leave();
  }
};

const validatePackType = async (ctx, type) => {
  const isNormal = Boolean(match(PACK_TYPES.NORMAL)(type, ctx));
  const isAnimated = Boolean(match(PACK_TYPES.ANIMATED)(type, ctx));

  // none of pack types was chosen (none of keyboard btns was clicked)
  if (!isNormal && !isAnimated) {
    await replies.replyErrorPackType(ctx);
    return false;
  }

  return true;
};

const validatePackTitle = async (ctx, title) => {
  if (!validateNameLength(title)) {
    await replies.replyErrorTitleTooLong(ctx);
    return false;
  }
  return true;
};

const validatePackName = async (ctx, name) => {
  if (!validateNameLength(name)) {
    await replies.replyErrorNameTooLong(ctx);
    return false;
  }

  if (!validateNameSymbols(name)) {
    await replies.replyErrorNameInvalid(ctx);
    return false;
  }

  return true;
};

module.exports = {
  createPack,
  copyPack,
  validatePackType,
  validatePackTitle,
  validatePackName,
};
