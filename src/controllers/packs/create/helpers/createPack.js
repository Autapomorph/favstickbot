const replies = require('../replies');
const Pack = require('../../../../models/Pack');
const getMainKeyboard = require('../../../../keyboards/main');
const createPack = require('../../../../utils/packs/create');
const clearPack = require('../../../../utils/packs/clear');
const { replyErrorTelegram } = require('../../../../utils/errors/reply');
const ERROR_TYPES = require('../../../../utils/errors/types');
const ERROR_SETS = require('../../../../utils/errors/sets');
const validateError = require('../../../../utils/errors/validateErrorType');
const logger = require('../../../../utils/logger');

module.exports = async (ctx, user, packToCreate, keyboard) => {
  try {
    const isCreated = await createPack(ctx, packToCreate);
    if (isCreated) {
      await clearPack(ctx, packToCreate);
    }
  } catch (error) {
    const {
      STICKERSET_INVALID_NAME,
      STICKERSET_NAME_OCCUPIED,
      CREATED_STICKERSET_NOT_FOUND,
    } = ERROR_TYPES.TELEGRAM;

    if (validateError(CREATED_STICKERSET_NOT_FOUND, error)) {
      logger.error(error, { sentry: false });
      return;
    }

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

    if (!validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      await replyErrorTelegram(ctx, error, {
        ...getMainKeyboard(ctx),
        reply_to_message_id: ctx.message.message_id,
        allow_sending_without_reply: true,
      });
    }

    ctx.scene.leave();
    throw error;
  }

  try {
    // eslint-disable-next-line no-param-reassign
    user.selectedPack = await Pack.create({
      userId: user.id,
      name: packToCreate.name,
      title: packToCreate.title,
      isAnimated: packToCreate.isAnimated,
    });
    await user.save();

    return await replies.replySuccess(ctx, user.selectedPack, keyboard);
  } catch (error) {
    logger.error(error);

    if (!validateError(ERROR_SETS.DO_NOT_REPLY, error)) {
      await replyErrorTelegram(ctx, error, {
        ...getMainKeyboard(ctx),
        reply_to_message_id: ctx.message.message_id,
        allow_sending_without_reply: true,
      });
    }

    ctx.scene.leave();
    throw error;
  }
};
