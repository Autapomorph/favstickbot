const { packLinkPrefix } = require('../../../config');
const { replyErrorToMessage } = require('../../../utils/errors/replyError');

const errorTypes = {
  RESTORE: 'actions.pack.reply.error.restore',
};

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
  return replyErrorToMessage(ctx, errorTypes.RESTORE);
};

module.exports = {
  replySuccess,
  errorTypes,
  replyErrorRestore,
};
