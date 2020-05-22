const getMainKeyboard = require('../../../keyboards/main');
const getCancelKeyboard = require('../../../keyboards/cancel');
const getPackTypeKeyboard = require('../../../keyboards/packType');
const { packNameMaxLength, packLinkPrefix } = require('../../../config');
const { replyErrorToMessage, replyErrorWithResource } = require('../../../utils/errors/replyError');

const errorTypes = {
  TITLE_TOO_LONG: 'scenes.pack_create.reply.error.title_long',
  NAME_TOO_LONG: 'scenes.pack_create.reply.error.name_long',
  NAME_INVALID: 'scenes.pack_create.reply.error.name_invalid',
  NAME_OCCUPIED: 'scenes.pack_create.reply.error.name_occupied',
};

const replyPackType = async ctx => {
  const packNewTypeKeyboard = getPackTypeKeyboard(ctx, {
    reply_to_message_id: ctx.message.message_id,
  });

  return ctx.replyWithHTML(ctx.i18n.t('scenes.pack_create.pack_type'), packNewTypeKeyboard);
};

const replyPackTitle = async ctx => {
  const cancelKeyboard = getCancelKeyboard(ctx, {
    reply_to_message_id: ctx.message.message_id,
  });

  return ctx.replyWithHTML(ctx.i18n.t('scenes.pack_create.pack_title'), cancelKeyboard);
};

const replyPackName = async ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('scenes.pack_create.pack_name'), {
    reply_to_message_id: ctx.message.message_id,
  });
};

const replySuccess = async (ctx, createdPack, extra) => {
  if (!extra) {
    // eslint-disable-next-line no-param-reassign
    extra = getMainKeyboard(ctx);
  }

  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.pack_create.reply.ok', {
      title: createdPack.title,
      link: `${packLinkPrefix}${createdPack.name}`,
    }),
    {
      reply_to_message_id: ctx.message.message_id,
      ...extra,
    },
  );
};

const replyErrorTooLong = async (ctx, tKey) => {
  return replyErrorWithResource(
    ctx,
    tKey,
    {
      max: packNameMaxLength,
    },
    {
      reply_to_message_id: ctx.message.message_id,
    },
  );
};

const replyErrorPackType = async ctx => {
  return replyPackType(ctx);
};

const replyErrorTitleTooLong = async ctx => {
  return replyErrorTooLong(ctx, errorTypes.TITLE_TOO_LONG);
};

const replyErrorNameTooLong = async ctx => {
  return replyErrorTooLong(ctx, errorTypes.NAME_TOO_LONG);
};

const replyErrorNameInvalid = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.NAME_INVALID);
};

const replyErrorNameOccupied = async ctx => {
  return replyErrorToMessage(ctx, errorTypes.NAME_OCCUPIED);
};

module.exports = {
  replyPackType,
  replyPackTitle,
  replyPackName,
  replySuccess,
  errorTypes,
  replyErrorPackType,
  replyErrorTooLong,
  replyErrorTitleTooLong,
  replyErrorNameTooLong,
  replyErrorNameInvalid,
  replyErrorNameOccupied,
};
