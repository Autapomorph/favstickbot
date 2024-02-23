import { Pack } from '../../../../models/Pack.js';
import { options } from './options.js';
import { packLinkPrefix } from '../../../../config/packs.js';
import * as packPostfix from '../../../../utils/packs/postfix.js';
import { escapeHTML } from '../../../../utils/common/escapeHTML.js';

const perPage = options.maxRows;

const getBodyText = (ctx, packsCount, selectedPack) => {
  if (packsCount <= 0) {
    return ctx.i18n.t('cmd.packs.reply.empty');
  }

  let text = ctx.i18n.t('cmd.packs.reply.list');
  if (selectedPack) {
    text += ctx.i18n.t('cmd.packs.reply.selected', {
      title: escapeHTML(selectedPack.title),
      link: `${packLinkPrefix}${selectedPack.name}`,
    });
  }

  return text;
};

export const getMenuBody = async ctx => {
  const { user } = ctx.state;
  const visiblePacksCount = await Pack.find().byUser(user.id).byIsArchived(false).countDocuments();
  const text = getBodyText(ctx, visiblePacksCount, user.selectedPack);
  return { text, parse_mode: 'HTML' };
};

const getChoiceText = (user, { _id: id, title, isAnimated, isArchived }) => {
  let text = title;
  text = isAnimated ? `${title} (Anim)` : text;
  text = isArchived ? `🗃 ${text}` : text;
  text = user.selectedPack?.id === id ? `☑️ ${text}` : text;
  return text;
};

const getPacksCount = async (user, showArchivedPacks) => {
  let packsCountQuery = Pack.find().byUser(user.id).countDocuments();
  if (!showArchivedPacks) packsCountQuery = packsCountQuery.byIsArchived(false);
  return packsCountQuery;
};

export const getMenuChoices = async ctx => {
  const { user } = ctx.state;
  const { showArchivedPacks } = user.settings;

  const packsCount = await getPacksCount(user, showArchivedPacks);
  if (packsCount <= getSkip(ctx)) {
    setPage(ctx, 1);
  }

  let packsQuery = Pack.find()
    .byUser(user.id)
    .skip(getSkip(ctx))
    .limit(perPage)
    .select({ title: 1, isAnimated: 1, isArchived: 1 });
  packsQuery = showArchivedPacks
    ? packsQuery.sort({ isArchived: 'asc', updatedAt: 'desc' })
    : packsQuery.byIsArchived(false);
  const packs = await packsQuery;

  return packs.reduce((acc, pack) => {
    const trimmedPackId = packPostfix.trim(pack.id, ctx.botInfo.username);
    const choiceText = getChoiceText(user, pack);
    acc[trimmedPackId] = choiceText;
    return acc;
  }, {});
};

export async function getTotalPages(ctx) {
  const { user } = ctx.state;
  const { showArchivedPacks } = user.settings;

  const packsCount = await getPacksCount(user, showArchivedPacks);
  return Math.ceil(packsCount / perPage);
}

export function getCurrentPage(ctx) {
  const { packListPage } = ctx.session;
  if (!Number.parseInt(packListPage, 10) || packListPage <= 0) setPage(ctx, 1);
  return ctx.session.packListPage;
}

export function setPage(ctx, page) {
  ctx.session.packListPage = page;
}

function getSkip(ctx) {
  const currentPage = getCurrentPage(ctx);
  const skip = (currentPage - 1) * perPage;
  return skip >= 0 ? skip : 0;
}
