const Extra = require('telegraf/extra');

const getMainKeyboard = require('../../../keyboards/main');
const getCancelKeyboard = require('../../../keyboards/cancel');
const getPackTypeKeyboard = require('../../../keyboards/packType');
const { packNameMaxLength, packLinkPrefix } = require('../../../config');
const ERROR_TYPES = require('../../../utils/errors/errorTypes');
const { replyErrorToMessage, replyErrorWithResource } = require('../../../utils/errors/reply');

const replyPackType = async ctx => {
  const packNewTypeKeyboard = Extra.markup(getPackTypeKeyboard(ctx)).inReplyTo(
    ctx.message.message_id,
  );
  return ctx.replyWithHTML(ctx.i18n.t('scenes.pack_create.pack_type'), packNewTypeKeyboard);
};

const replyPackTitle = async ctx => {
  const cancelKeyboard = Extra.markup(getCancelKeyboard(ctx)).inReplyTo(ctx.message.message_id);
  return ctx.replyWithHTML(ctx.i18n.t('scenes.pack_create.pack_title'), cancelKeyboard);
};

const replyPackName = async ctx => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.pack_create.pack_name'),
    Extra.inReplyTo(ctx.message.message_id),
  );
};

const replySuccess = async (ctx, createdPack, keyboard = getMainKeyboard(ctx)) => {
  return ctx.replyWithHTML(
    ctx.i18n.t('scenes.pack_create.reply.ok', {
      title: createdPack.title,
      link: `${packLinkPrefix}${createdPack.name}`,
    }),
    Extra.inReplyTo(ctx.message.message_id).markup(keyboard),
  );
};

const replyErrorTooLong = async (ctx, tKey) => {
  return replyErrorWithResource(
    ctx,
    tKey,
    {
      max: packNameMaxLength,
    },
    Extra.inReplyTo(ctx.message.message_id),
  );
};

const replyErrorPackType = async ctx => {
  return replyPackType(ctx);
};

const replyErrorTitleTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.PACKS.TITLE_TOO_LONG);
};

const replyErrorNameTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.PACKS.NAME_TOO_LONG);
};

const replyErrorNameInvalid = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.NAME_INVALID);
};

const replyErrorNameOccupied = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.PACKS.NAME_OCCUPIED);
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
