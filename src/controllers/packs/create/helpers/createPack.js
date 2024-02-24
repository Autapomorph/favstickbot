import * as replies from '../replies.js';
import { Pack } from '../../../../models/Pack.js';
import { getMainKeyboard } from '../../../../keyboards/main.js';
import { createPack as createPackHelper } from '../../../../utils/packs/create.js';
import { clearPack } from '../../../../utils/packs/clear.js';
import { replyErrorTelegram } from '../../../../utils/errors/reply.js';
import * as ERROR_TYPES from '../../../../utils/errors/types/index.js';
import * as ERROR_SETS from '../../../../utils/errors/sets/index.js';
import { validateTelegramErrorType } from '../../../../utils/errors/validateErrorType.js';
import { createMeta } from '../../../../utils/logger/meta/createMeta.js';
import { logger } from '../../../../utils/logger/index.js';

export const createPack = async (ctx, user, packToCreate, keyboard) => {
  try {
    const isCreated = await createPackHelper(ctx, packToCreate);
    if (isCreated) {
      await clearPack(ctx, packToCreate);
    }
  } catch (error) {
    const { STICKERSET_INVALID_NAME, STICKERSET_NAME_OCCUPIED, CREATED_STICKERSET_NOT_FOUND } =
      ERROR_TYPES.TELEGRAM;

    if (validateTelegramErrorType(CREATED_STICKERSET_NOT_FOUND, error)) {
      logger.error(error, { sentry: false });
      return;
    }

    if (validateTelegramErrorType(STICKERSET_INVALID_NAME, error)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameInvalid(ctx);
      ctx.scene.reenter();
      throw error;
    }

    if (validateTelegramErrorType(STICKERSET_NAME_OCCUPIED, error)) {
      logger.error(error, { sentry: false });
      await replies.replyErrorNameOccupied(ctx);
      ctx.scene.reenter();
      throw error;
    }

    logger.error(error, createMeta(ctx));

    if (!validateTelegramErrorType(ERROR_SETS.DO_NOT_REPLY, error)) {
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
    logger.error(error, createMeta(ctx));

    if (!validateTelegramErrorType(ERROR_SETS.DO_NOT_REPLY, error)) {
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
