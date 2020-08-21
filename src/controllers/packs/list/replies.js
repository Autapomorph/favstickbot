const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const Pack = require('../../../models/Pack');
const { getPackListText } = require('./helpers');
const getPackListKeyboard = require('../../../keyboards/inline/packList');
const { packLinkPrefix } = require('../../../config');
const escapeHTML = require('../../../utils/common/escapeHTML');
const getSelectedPackId = require('../../../utils/packs/getSelectedPackId');
const isKeyboardDifferent = require('../../../utils/keyboards/isDifferent');

const replyPackList = async (ctx, text, keyboard, messageId) => {
  if (messageId !== undefined) {
    return ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      null,
      text,
      Extra.HTML().markup(Markup.inlineKeyboard(keyboard)),
    );
  }

  return ctx.replyWithHTML(text, Markup.inlineKeyboard(keyboard).extra());
};

const replyPackListOnAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const packs = await Pack.findVisible(user.id);
  const selectedPackId = getSelectedPackId(user);

  const messageText = getPackListText(ctx, packs);
  const keyboard = getPackListKeyboard(packs, pack ? pack.id : selectedPackId);

  const prevMessage = pack ? ctx.callbackQuery.message : ctx.callbackQuery.message.reply_to_message;
  const prevMessageId = prevMessage.message_id;
  const prevKeyboard = prevMessage.reply_markup && prevMessage.reply_markup.inline_keyboard;

  if (isKeyboardDifferent(prevKeyboard, keyboard)) {
    await replyPackList(ctx, messageText, keyboard, prevMessageId);
  }

  return prevMessageId;
};

const replyPackSelectAction = async (ctx, pack) => {
  const prevMessageId = await replyPackListOnAction(ctx, pack);

  await ctx.answerCbQuery();

  const cbBtnText = pack.isHidden ? 'actions.pack.btn.restore' : 'actions.pack.btn.hide';
  return ctx.replyWithHTML(
    ctx.i18n.t('actions.pack.reply.selected', {
      title: escapeHTML(pack.title),
      link: `${packLinkPrefix}${pack.name}`,
    }),
    Extra.inReplyTo(prevMessageId).markup(
      Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.i18n.t(cbBtnText), `pack_hide:${pack.id}`)],
      ]),
    ),
  );
};

const replyPackHideAction = async (ctx, pack) => {
  await replyPackListOnAction(ctx);

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      Markup.callbackButton(ctx.i18n.t('actions.pack.btn.restore'), `pack_restore:${pack.id}`),
    ]),
  );

  return ctx.answerCbQuery(ctx.i18n.t('actions.pack.answer.hidden'));
};

const replyPackRestoreAction = async (ctx, pack) => {
  await replyPackListOnAction(ctx);

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      Markup.callbackButton(ctx.i18n.t('actions.pack.btn.hide'), `pack_hide:${pack.id}`),
    ]),
  );

  return ctx.answerCbQuery(ctx.i18n.t('actions.pack.answer.restored'));
};

module.exports = {
  replyPackList,
  replyPackSelectAction,
  replyPackHideAction,
  replyPackRestoreAction,
};
