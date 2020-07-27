const Markup = require('telegraf/markup');

const Pack = require('../../../models/Pack');
const { getPackListText, getPackListKeyboard } = require('./helpers');
const { packLinkPrefix } = require('../../../config');
const escapeHTML = require('../../../utils/common/escapeHTML');
const getSelectedPackId = require('../../../utils/packs/getSelectedPackId');
const { isNextKeyboardDifferent } = require('../../../utils/keyboards');
const { replyError } = require('../../../utils/errors/replyError');

const errorTypes = {
  ACCESS_DENIED: 'actions.pack.reply.error.access_denied',
};

const replyPackList = async (ctx, text, keyboard, messageId) => {
  if (messageId !== undefined) {
    return ctx.telegram.editMessageText(ctx.chat.id, messageId, null, text, {
      parse_mode: 'HTML',
      reply_markup: Markup.inlineKeyboard(keyboard),
    });
  }

  return ctx.replyWithHTML(text, {
    reply_markup: Markup.inlineKeyboard(keyboard),
  });
};

const replyPackSelectAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const packs = await Pack.findVisible(user.id);
  const packListText = getPackListText(ctx, packs);
  const packListKeyboard = getPackListKeyboard(packs, pack.id);
  const prevPackListMessage = ctx.callbackQuery.message;
  const prevPackListMessageId = prevPackListMessage.message_id;
  const prevPackListMessageKeyboard =
    prevPackListMessage.reply_markup && prevPackListMessage.reply_markup.inline_keyboard;

  if (isNextKeyboardDifferent(prevPackListMessageKeyboard, packListKeyboard)) {
    await replyPackList(ctx, packListText, packListKeyboard, prevPackListMessageId);
  }

  await ctx.answerCbQuery();

  const cbBtnText = pack.isHidden ? 'actions.pack.btn.restore' : 'actions.pack.btn.hide';
  return ctx.replyWithHTML(
    ctx.i18n.t('actions.pack.reply.selected', {
      title: escapeHTML(pack.title),
      link: `${packLinkPrefix}${pack.name}`,
    }),
    {
      reply_to_message_id: prevPackListMessageId,
      reply_markup: Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.i18n.t(cbBtnText), `pack_hide:${pack.id}`)],
      ]),
    },
  );
};

const replyPackHideAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const packs = await Pack.findVisible(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListText = getPackListText(ctx, packs);
  const packListKeyboard = getPackListKeyboard(packs, selectedPackId);
  const prevPackListMessage = ctx.callbackQuery.message.reply_to_message;
  const prevPackListMessageId = prevPackListMessage.message_id;
  const prevPackListMessageKeyboard =
    prevPackListMessage.reply_markup && prevPackListMessage.reply_markup.inline_keyboard;

  if (isNextKeyboardDifferent(prevPackListMessageKeyboard, packListKeyboard)) {
    await replyPackList(ctx, packListText, packListKeyboard, prevPackListMessageId);
  }

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      Markup.callbackButton(ctx.i18n.t('actions.pack.btn.restore'), `pack_restore:${pack.id}`),
    ]),
  );

  return ctx.answerCbQuery(ctx.i18n.t('actions.pack.answer.hidden'));
};

const replyPackRestoreAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const packs = await Pack.findVisible(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListText = getPackListText(ctx, packs);
  const packListKeyboard = getPackListKeyboard(packs, selectedPackId);
  const prevPackListMessage = ctx.callbackQuery.message.reply_to_message;
  const prevPackListMessageId = prevPackListMessage.message_id;
  const prevPackListMessageKeyboard =
    prevPackListMessage.reply_markup && prevPackListMessage.reply_markup.inline_keyboard;

  if (isNextKeyboardDifferent(prevPackListMessageKeyboard, packListKeyboard)) {
    await replyPackList(ctx, packListText, packListKeyboard, prevPackListMessageId);
  }

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      Markup.callbackButton(ctx.i18n.t('actions.pack.btn.hide'), `pack_hide:${pack.id}`),
    ]),
  );

  return ctx.answerCbQuery(ctx.i18n.t('actions.pack.answer.restored'));
};

const replyErrorAccessDenied = async ctx => {
  await ctx.answerCbQuery();
  return replyError(ctx, errorTypes.ACCESS_DENIED);
};

module.exports = {
  replyPackList,
  replyPackSelectAction,
  replyPackHideAction,
  replyPackRestoreAction,
  errorTypes,
  replyErrorAccessDenied,
};
