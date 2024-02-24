import { getMainKeyboard } from '../../../keyboards/main.js';
import { getCancelKeyboard } from '../../../keyboards/cancel.js';
import { getPackTypeKeyboard } from '../../../keyboards/packType.js';
import { packNameMaxLength, packLinkPrefix } from '../../../config/packs.js';
import * as ERROR_TYPES from '../../../utils/errors/types/index.js';
import { replyErrorToMessage } from '../../../utils/errors/reply.js';
import { escapeHTML } from '../../../utils/common/escapeHTML.js';

export const replyPackType = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.pack_create.pack_type'), {
    ...getPackTypeKeyboard(ctx),
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
};

export const replyPackTitle = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('scene.pack_create.pack_title'), {
    ...getCancelKeyboard(ctx),
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
    parse_mode: 'HTML',
  });
};

export const replyPackName = async ctx => {
  return ctx.sendMessage(
    ctx.i18n.t('scene.pack_create.pack_name', { botUsername: ctx.botInfo.username }),
    {
      ...getCancelKeyboard(ctx),
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
      parse_mode: 'HTML',
    },
  );
};

export const replySuccess = async (ctx, createdPack, keyboard = getMainKeyboard(ctx)) => {
  return ctx.sendMessage(
    ctx.i18n.t('scene.pack_create.reply.ok', {
      title: escapeHTML(createdPack.title),
      link: `${packLinkPrefix}${createdPack.name}`,
    }),
    {
      ...keyboard,
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
      parse_mode: 'HTML',
    },
  );
};

const replyErrorTooLong = async (ctx, tKey) => {
  return replyErrorToMessage(ctx, tKey, {
    max: packNameMaxLength,
  });
};

export const replyErrorPackType = async ctx => {
  return replyPackType(ctx);
};

export const replyErrorTitleTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.APP.PACKS.CREATE.TITLE_TOO_LONG);
};

export const replyErrorNameTooLong = async ctx => {
  return replyErrorTooLong(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_TOO_LONG);
};

export const replyErrorNameInvalid = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_INVALID);
};

export const replyErrorNameOccupied = async ctx => {
  return replyErrorToMessage(ctx, ERROR_TYPES.APP.PACKS.CREATE.NAME_OCCUPIED);
};
