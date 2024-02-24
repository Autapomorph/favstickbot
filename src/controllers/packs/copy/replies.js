import { packLinkPrefix } from '../../../config/packs.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import { replyError, replyErrorToMessage } from '../../../utils/errors/reply.js';
import { escapeHTML } from '../../../utils/common/escapeHTML.js';

export const replyEnter = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.pack_copy.reply.enter'), {
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
    parse_mode: 'HTML',
  });
};

export const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.COPY.PACK_NOT_FOUND);
};

export const replyErrorUnknown = async (ctx, extra) => {
  return replyError(ctx, ERROR_TYPES.APP.PACKS.COPY.UNKNOWN, null, extra);
};

export const replyProgress = async (ctx, packToCopy, newPack) => {
  return ctx.sendMessage(
    ctx.i18n.t('scene.pack_copy.reply.progress', {
      originalTitle: escapeHTML(packToCopy.title),
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: escapeHTML(newPack.title),
      link: `${packLinkPrefix}${newPack.name}`,
      current: 0,
      total: packToCopy.stickers.length,
    }),
    { parse_mode: 'HTML' },
  );
};

export const editProgress = async (ctx, packToCopy, newPack, message, index = 0) => {
  return ctx.telegram.editMessageText(
    message.chat.id,
    message.message_id,
    null,
    ctx.i18n.t('scene.pack_copy.reply.progress', {
      originalTitle: escapeHTML(packToCopy.title),
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: escapeHTML(newPack.title),
      link: `${packLinkPrefix}${newPack.name}`,
      current: index + 1,
      total: packToCopy.stickers.length,
    }),
    { parse_mode: 'HTML' },
  );
};

export const replySuccess = async (ctx, message, packToCopy, newPack, extra) => {
  ctx.deleteMessage(message.message_id);
  return ctx.sendMessage(
    ctx.i18n.t('scene.pack_copy.reply.done', {
      originalTitle: escapeHTML(packToCopy.title),
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: escapeHTML(newPack.title),
      link: `${packLinkPrefix}${newPack.name}`,
    }),
    { ...extra, parse_mode: 'HTML' },
  );
};
