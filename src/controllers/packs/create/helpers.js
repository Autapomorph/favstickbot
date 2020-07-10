const { match } = require('telegraf-i18n');

const replies = require('./replies');
const Pack = require('../../../models/Pack');
const getCancelKeyboard = require('../../../keyboards/cancel');
const getMainKeyboard = require('../../../keyboards/main');
const { replyProgress, editProgress, replySuccess } = require('../copy/helpers');
const copyPackHelper = require('../../../utils/packs/copy');
const createPackTg = require('../../../utils/packs/create');
const { validateNameLength, validateNameSymbols } = require('../../../utils/packs/validate');
const { replyErrorTelegram } = require('../../../utils/errors/replyError');
const logger = require('../../../utils/logger');

const packTypes = {
  STATIC: 'scenes.pack_create.btn.static',
  ANIMATED: 'scenes.pack_create.btn.anim',
};

const createPack = async (ctx, user, packToCreate, nextOperation) => {
  try {
    await createPackTg(ctx, packToCreate);

    // eslint-disable-next-line no-param-reassign
    user.selectedPack = await Pack.createNew({
      owner: user.id,
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
    // Bad Request: invalid sticker set name is specified
    if (/invalid.*name/i.test(error.description)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameInvalid(ctx);
      ctx.scene.reenter();
      throw error;
    }

    // Bad Request: sticker set name is already occupied
    if (/name.*occupied/i.test(error.description)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameOccupied(ctx);
      ctx.scene.reenter();
      throw error;
    }

    logger.error(error);
    await replyErrorTelegram(ctx, error, {
      reply_to_message_id: ctx.message.message_id,
      ...getMainKeyboard(ctx),
    });
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
      replySuccess(ctx, message, packToCopy, newPack, getMainKeyboard(ctx));

    copyStickerByOne(copyPackGen, ctx, successCallback);
  } catch (error) {
    logger.error(error);
    await replyErrorTelegram(ctx, error, getMainKeyboard(ctx));
    return ctx.scene.leave();
  }
};

const validatePackType = async (ctx, type) => {
  const isStatic = Boolean(match(packTypes.STATIC)(type, ctx));
  const isAnimated = Boolean(match(packTypes.ANIMATED)(type, ctx));

  // none of pack types was chosen (none of keyboard btns was clicked)
  if (!isStatic && !isAnimated) {
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
  packTypes,
  ...replies,
};
