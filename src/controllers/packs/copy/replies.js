const Extra = require('telegraf/extra');

const { packLinkPrefix } = require('../../../config');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const { replyError, replyErrorToMessage } = require('../../../utils/errors/reply');

const replyEnter = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scene.pack_copy.reply.enter'), {
    ...Extra.inReplyTo(ctx.message.message_id),
    allow_sending_without_reply: true,
  });
};

const replyErrorNotFound = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.COPY.NOT_FOUND);
};

const replyErrorUnknown = async (ctx, extra) => {
  return replyError(ctx, ERROR_TYPES.PACKS.COPY.UNKNOWN, extra);
};

const replyProgress = async (ctx, packToCopy, newPack) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scene.pack_copy.reply.progress', {
      originalTitle: packToCopy.title,
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: newPack.title,
      link: `${packLinkPrefix}${newPack.name}`,
      current: 0,
      total: packToCopy.stickers.length,
    }),
  );
};

const editProgress = async (ctx, packToCopy, newPack, message, index = 0) => {
  return ctx.telegram.editMessageText(
    message.chat.id,
    message.message_id,
    null,
    ctx.i18n.t('scene.pack_copy.reply.progress', {
      originalTitle: packToCopy.title,
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: newPack.title,
      link: `${packLinkPrefix}${newPack.name}`,
      current: index + 1,
      total: packToCopy.stickers.length,
    }),
    { parse_mode: 'HTML' },
  );
};

const replySuccess = async (ctx, message, packToCopy, newPack, extra) => {
  ctx.deleteMessage(message.message_id);
  return ctx.replyWithHTML(
    ctx.i18n.t('scene.pack_copy.reply.done', {
      originalTitle: packToCopy.title,
      originalLink: `${packLinkPrefix}${packToCopy.name}`,
      title: newPack.title,
      link: `${packLinkPrefix}${newPack.name}`,
    }),
    extra,
  );
};

module.exports = {
  replyEnter,
  replyProgress,
  editProgress,
  replySuccess,
  replyErrorNotFound,
  replyErrorUnknown,
};
