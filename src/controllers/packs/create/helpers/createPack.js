const Extra = require('telegraf/extra');

const replies = require('../replies');
const Pack = require('../../../../models/Pack');
const getCancelKeyboard = require('../../../../keyboards/cancel');
const getMainKeyboard = require('../../../../keyboards/main');

const createPackTg = require('../../../../utils/packs/create');
const { replyErrorTelegram } = require('../../../../utils/errors/reply');
const ERROR_TYPES = require('../../../../utils/errors/errorTypes');
const validateError = require('../../../../utils/errors/validateRegexErrorType');
const logger = require('../../../../utils/logger');

module.exports = async (ctx, user, packToCreate, nextOperation) => {
  try {
    await createPackTg(ctx, packToCreate);

    // eslint-disable-next-line no-param-reassign
    user.selectedPack = await Pack.create({
      userId: user.id,
      name: packToCreate.name,
      title: packToCreate.title,
      isAnimated: packToCreate.isAnimated,
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
