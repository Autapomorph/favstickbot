const { packLinkPrefix } = require('../../../config');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const { replyErrorToMessage } = require('../../../utils/errors/reply');

const replySuccess = async (ctx, pack) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('actions.pack.reply.restored', {
      title: pack.title,
      link: `${packLinkPrefix}${pack.name}`,
    }),
    {
      reply_to_message_id: ctx.message.message_id,
    },
  );
};

const replyErrorRestore = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.RESTORE);
};

module.exports = {
  replySuccess,
  replyErrorRestore,
};
