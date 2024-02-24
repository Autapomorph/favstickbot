import { Scenes, Composer } from 'telegraf';
import { message } from 'telegraf/filters';

import { Session } from '../../../models/Session.js';
import { copyPack } from './helpers/copyPack.js';
import { getSessionKey } from '../../../utils/sessions/getKey.js';
import { getCancelKeyboard } from '../../../keyboards/cancel.js';

export const packCopyScene = new Scenes.BaseScene('PACKS/COPY');

const getIsAborted = async sessionKey => {
  const session = await Session.findById(sessionKey);
  /* eslint-disable no-underscore-dangle */
  if (!session?.data?.__scenes) return true;
  return session.data.__scenes.current !== 'PACKS/COPY';
  /* eslint-enable no-underscore-dangle */
};

packCopyScene.enter(async ctx => {
  const { user } = ctx.state;
  const { packToCopy } = ctx.scene.state;
  const sessionKey = getSessionKey(ctx);
  await Session.findByIdAndUpdate(sessionKey, {
    'data.__scenes.current': 'PACKS/COPY',
  });
  return copyPack(ctx, packToCopy, user.selectedPack, getIsAborted.bind(null, sessionKey));
});

packCopyScene.on(message(), async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.pack_copy.reply.help'), { ...getCancelKeyboard(ctx) });
});

// Drop any updates
packCopyScene.use(Composer.drop(true));

// Delete data from session after leave
packCopyScene.leave(async ctx => {
  const sessionKey = getSessionKey(ctx);
  return Session.findByIdAndUpdate(sessionKey, {
    $unset: { 'data.__scenes': '' },
  });
});
