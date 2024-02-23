import { getMainKeyboard } from '../../../../keyboards/main.js';
import { replyProgress, editProgress, replySuccess, replyErrorUnknown } from '../replies.js';
import { copyPack as copyPackHelper } from '../../../../utils/packs/copy.js';
import { createMeta } from '../../../../utils/logger/meta/createMeta.js';
import { logger } from '../../../../utils/logger/index.js';

const onProgress = (ctx, packToCopy, newPack, message) => async index => {
  await editProgress(ctx, packToCopy, newPack, message, index);
};

const onSuccess = (ctx, message, packToCopy, newPack, extra) => async () => {
  await replySuccess(ctx, message, packToCopy, newPack, extra);
  return ctx.scene.leave();
};

const onFail = (ctx, extra) => async error => {
  logger.error(error, createMeta(ctx));
  await replyErrorUnknown(ctx, extra);
  return ctx.scene.leave();
};

export const copyPack = async (ctx, packToCopy, newPack, getIsAborted) => {
  const extra = { ...getMainKeyboard(ctx) };
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
