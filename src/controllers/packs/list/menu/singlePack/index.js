const { MenuTemplate } = require('telegraf-inline-menu');

const deleteConfirmMenu = require('./deleteConfirm');
const Pack = require('../../../../../models/Pack');
const actions = require('../../actions');
const { getMenuBody } = require('./helpers');
const packPostfix = require('../../../../../utils/packs/postfix');

const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.select'), 's', {
  hide: async ctx => {
    const { user } = ctx.state;
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    if (!user.selectedPack) return false;
    return user.selectedPack.id === packId || !pack || pack.isArchived === true;
    // return user.selectedPack.id === packId || pack?.isArchived === true;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await actions.select(ctx, packId);
    return '..';
  },
});

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.archive'), 'a', {
  hide: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    return !pack || pack.isArchived === true;
    // return pack?.isArchived === true;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await actions.archive(ctx, packId);
    return true;
  },
});

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.restore'), 'r', {
  hide: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    return !pack || pack.isArchived === false;
    // return pack?.isArchived === false;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await actions.restore(ctx, packId);
    return true;
  },
});

menu.submenu(
  ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.delete'),
  'd',
  deleteConfirmMenu,
);

menu.navigate(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.back'), '..');

module.exports = menu;
