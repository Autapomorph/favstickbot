const Markup = require('telegraf/markup');

const { packLinkPrefix } = require('../../../config');
const escapeHTML = require('../../../utils/common/escapeHTML');
const { getVisiblePacks, getSelectedPackId } = require('../../../utils/packs');
const { replyError } = require('../../../utils/errors/replyError');

const errorTypes = {
  ACCESS_DENIED: 'actions.pack.reply.error.access_denied',
};

const getPackListKeyboard = (packs, selectedPackId) => {
  return packs.map(({ id, title, isAnimated }) => {
    let packText = isAnimated ? `🅰️ ${title}` : title;
    packText = String(selectedPackId) === String(id) ? `✅ ${packText}` : packText;
    return [Markup.callbackButton(packText, `pack_select:${id}`)];
  });
};

const getPackListText = (ctx, packs) =>
  packs.length ? ctx.i18n.t('cmd.packs.reply.list') : ctx.i18n.t('cmd.packs.reply.empty');

const replyPackList = async (ctx, packs, keyboard) => {
  const text = getPackListText(ctx, packs);
  return ctx.replyWithHTML(text, {
    reply_markup: Markup.inlineKeyboard(keyboard),
  });
};

const editPackList = async (ctx, packs, keyboard, messageId) => {
  const text = getPackListText(ctx, packs);
  return ctx.telegram.editMessageText(ctx.chat.id, messageId, null, text, {
    parse_mode: 'HTML',
    reply_markup: Markup.inlineKeyboard(keyboard),
  });
};

const replyPackSelectAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const packs = await getVisiblePacks(user.id);
  const packListKeyboard = getPackListKeyboard(packs, pack.id);
  const packListMessageId = ctx.callbackQuery.message.message_id;
  const cbBtnText = pack.isHidden ? 'actions.pack.btn.restore' : 'actions.pack.btn.hide';

  if (packListMessageId) {
    editPackList(ctx, packs, packListKeyboard, packListMessageId).catch(() => {});
  } else {
    replyPackList(ctx, packs, packListKeyboard);
  }

  ctx.answerCbQuery();
  return ctx.replyWithHTML(
    ctx.i18n.t('actions.pack.reply.selected', {
      title: escapeHTML(pack.title),
      link: `${packLinkPrefix}${pack.name}`,
    }),
    {
      reply_to_message_id: packListMessageId,
      reply_markup: Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.i18n.t(cbBtnText), `pack_hide:${pack.id}`)],
      ]),
    },
  );
};

const replyPackHideRestoreAction = async (ctx, pack) => {
  const { user } = ctx.session;
  const answerText = pack.isHidden ? 'actions.pack.answer.hidden' : 'actions.pack.answer.restored';
  const cbBtnText = pack.isHidden ? 'actions.pack.btn.restore' : 'actions.pack.btn.hide';

  const packs = await getVisiblePacks(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListKeyboard = getPackListKeyboard(packs, selectedPackId);
  const packListMessageId = ctx.callbackQuery.message.reply_to_message.message_id;

  if (packListMessageId) {
    await editPackList(ctx, packs, packListKeyboard, packListMessageId).catch(() => {});
  } else {
    await replyPackList(ctx, packs, packListKeyboard);
  }

  await ctx
    .editMessageReplyMarkup(
      Markup.inlineKeyboard([Markup.callbackButton(ctx.i18n.t(cbBtnText), `pack_hide:${pack.id}`)]),
    )
    .catch(() => {});

  return ctx.answerCbQuery(ctx.i18n.t(answerText));
};

const replyErrorAccessDenied = async ctx => {
  ctx.answerCbQuery();
  return replyError(ctx, errorTypes.ACCESS_DENIED);
};

module.exports = {
  replyPackList,
  editPackList,
  replyPackSelectAction,
  replyPackHideRestoreAction,
  getPackListKeyboard,
  errorTypes,
  replyErrorAccessDenied,
};
