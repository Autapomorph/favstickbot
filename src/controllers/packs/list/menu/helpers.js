const Pack = require('../../../../models/Pack');
const { packLinkPrefix } = require('../../../../config');
const packPostfix = require('../../../../utils/packs/postfix');
const escapeHTML = require('../../../../utils/common/escapeHTML');

const getBodyText = (ctx, packs, selectedPack) => {
  if (!packs.length) {
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

const getMenuBody = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await Pack.find({ userId: user.id, isArchived: false });
  const text = getBodyText(ctx, visiblePacks, user.selectedPack);
  return {
    text,
    parse_mode: 'HTML',
  };
};

const getChoiceText = (user, { _id: id, title, isAnimated, isArchived }) => {
  let text = title;
  text = isAnimated ? `${title} (Anim)` : text;
  text = isArchived ? `🗃 ${text}` : text;
  text = user.selectedPack && user.selectedPack.id === id ? `☑️ ${text}` : text;
  return text;
};

const getMenuChoices = async ctx => {
  const { user } = ctx.session;
  const packs = await (user.settings.showArchivedPacks
    ? Pack.find({ userId: user.id })
    : Pack.find({ userId: user.id, isArchived: false }));
  packs.sort((a, b) => Boolean(a.isArchived) - Boolean(b.isArchived));
  return packs.reduce((acc, pack) => {
    const trimmedPackId = packPostfix.trim(pack.id, ctx.options.username);
    const choiceText = getChoiceText(user, pack);
    acc[trimmedPackId] = choiceText;
    return acc;
  }, {});
};

module.exports = {
  getMenuBody,
  getMenuChoices,
};
