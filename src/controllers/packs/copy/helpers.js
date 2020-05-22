const { packLinkPrefix } = require('../../../config');
const { replyErrorToMessage } = require('../../../utils/errors/replyError');

const errorTypes = {
  COPY: 'actions.pack.reply.error.copy',
};

const replyEnter = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scenes.copy.reply.enter'), {
    reply_to_message_id: ctx.message.message_id,
  });
};

const replyErrorCopy = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.COPY);
};

const replyProgress = async (ctx, packToCopy, newPack) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.copy.reply.progress', {
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
    ctx.i18n.t('scenes.copy.reply.progress', {
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

const replySuccess = async (ctx, message, packToCopy, newPack, extra = {}) => {
  ctx.deleteMessage(message.message_id);
  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.copy.reply.done', {
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
  errorTypes,
  replyErrorCopy,
};
