const getMainKeyboard = require('../../../keyboards/main');
const getCancelKeyboard = require('../../../keyboards/cancel');
const getPackTypeKeyboard = require('../../../keyboards/packType');
const { packNameMaxLength, packLinkPrefix } = require('../../../config/packs');
const ERROR_TYPES = require('../../../utils/errors/types');
const { replyErrorToMessage } = require('../../../utils/errors/reply');

const replyPackType = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scene.pack_create.pack_type'), {
    ...getPackTypeKeyboard(ctx),
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
};

const replyPackTitle = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scene.pack_create.pack_title'), {
    ...getCancelKeyboard(ctx),
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
};

const replyPackName = async ctx => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scene.pack_create.pack_name', { botUsername: ctx.botInfo.username }),
    {
      ...getCancelKeyboard(ctx),
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    },
  );
};

const replySuccess = async (ctx, createdPack, keyboard = getMainKeyboard(ctx)) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scene.pack_create.reply.ok', {
      title: createdPack.title,
      link: `${packLinkPrefix}${createdPack.name}`,
    }),
    {
      ...keyboard,
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    },
  );
};

const replyErrorTooLong = async (ctx, tKey) => {
  return replyErrorToMessage(ctx, tKey, {
    max: packNameMaxLength,
  });
};

const replyErrorPackType = async ctx => {
  return replyPackType(ctx);
};

const replyErrorTitleTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.APP.PACKS.CREATE.TITLE_TOO_LONG);
};

const replyErrorNameTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_TOO_LONG);
};

const replyErrorNameInvalid = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_INVALID);
};

const replyErrorNameOccupied = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_OCCUPIED);
};

module.exports = {
  replyPackType,
  replyPackTitle,
  replyPackName,
  replySuccess,
  replyErrorPackType,
  replyErrorTooLong,
  replyErrorTitleTooLong,
  replyErrorNameTooLong,
  replyErrorNameInvalid,
  replyErrorNameOccupied,
};
