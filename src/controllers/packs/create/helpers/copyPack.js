const getMainKeyboard = require('../../../../keyboards/main');
const { replyProgress, editProgress, replySuccess } = require('../../copy/replies');
const copyPackHelper = require('../../../../utils/packs/copy');
const { replyErrorTelegram } = require('../../../../utils/errors/reply');
const logger = require('../../../../utils/logger');

const onProgress = (ctx, packToCopy, newPack, message) => async index => {
  await editProgress(ctx, packToCopy, newPack, message, index);
};

const onSuccess = (ctx, message, packToCopy, newPack, extra) => async () => {
  await replySuccess(ctx, message, packToCopy, newPack, extra);
  return ctx.scene.leave();
};

module.exports = async (ctx, packToCopy, newPack, checkAborted) => {
  try {
    const extra = getMainKeyboard(ctx).extra();
    const message = await replyProgress(ctx, packToCopy, newPack);
    const onProgressCb = onProgress(ctx, packToCopy, newPack, message);
    const onSuccessCb = onSuccess(ctx, message, packToCopy, newPack, extra);
    copyPackHelper(ctx, packToCopy, checkAborted, onProgressCb, onSuccessCb);
  } catch (error) {
    logger.error(error);
    await replyErrorTelegram(ctx, error, getMainKeyboard(ctx).extra());
    return ctx.scene.leave();
  }
};
