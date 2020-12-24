const getMainKeyboard = require('../../../../keyboards/main');
const {
  replyProgress,
  editProgress,
  replySuccess,
  replyErrorUnknown,
} = require('../../copy/replies');
const copyPackHelper = require('../../../../utils/packs/copy');
const logger = require('../../../../utils/logger');

const onProgress = (ctx, packToCopy, newPack, message) => async index => {
  await editProgress(ctx, packToCopy, newPack, message, index);
};

const onSuccess = (ctx, message, packToCopy, newPack, extra) => async () => {
  await replySuccess(ctx, message, packToCopy, newPack, extra);
  return ctx.scene.leave();
};

const onFail = (ctx, extra) => async error => {
  logger.error(error);
  await replyErrorUnknown(ctx, extra);
  return ctx.scene.leave();
};

module.exports = async (ctx, packToCopy, newPack, getIsAborted) => {
  const extra = getMainKeyboard(ctx).extra();
  const message = await replyProgress(ctx, packToCopy, newPack);

  const onProgressCb = onProgress(ctx, packToCopy, newPack, message);
  const onSuccessCb = onSuccess(ctx, message, packToCopy, newPack, extra);
  const onFailCb = onFail(ctx, extra);

  copyPackHelper(ctx, packToCopy, getIsAborted, onProgressCb)
    .then(result => {
      if (result) {
        return onSuccessCb();
      }
    })
    .catch(onFailCb);
};
