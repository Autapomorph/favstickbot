const Extra = require('telegraf/extra');

const replies = require('../replies');
const Pack = require('../../../../models/Pack');
const getMainKeyboard = require('../../../../keyboards/main');

const createPack = require('../../../../utils/packs/create');
const { replyErrorTelegram } = require('../../../../utils/errors/reply');
const ERROR_TYPES = require('../../../../utils/errors/errorTypes');
const ERROR_SETS = require('../../../../utils/errors/errorSets');
const validateError = require('../../../../utils/errors/validateErrorType');
const logger = require('../../../../utils/logger');

module.exports = async (ctx, user, packToCreate, keyboard) => {
  try {
    await createPack(ctx, packToCreate);

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

    if (!validateError(ERROR_SETS.DO_NOT_REPLY)) {
      await replyErrorTelegram(ctx, error, {
        ...Extra.markup(getMainKeyboard(ctx)).inReplyTo(ctx.message.message_id),
        allow_sending_without_reply: true,
      });
    }

    ctx.scene.leave();
    throw error;
  }
};
