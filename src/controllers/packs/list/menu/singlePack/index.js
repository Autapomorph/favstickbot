import { MenuTemplate } from 'telegraf-inline-menu';

import { menu as deleteConfirmMenu } from './deleteConfirm/index.js';
import { Pack } from '../../../../../models/Pack.js';
import { selectPack, archivePack, restorePack } from '../../actions.js';
import { getMenuBody } from './helpers.js';
import * as packPostfix from '../../../../../utils/packs/postfix.js';

export const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.select'), 's', {
  hide: async ctx => {
    const { user } = ctx.state;
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    if (!user.selectedPack) return false;
    return user.selectedPack.id === packId || pack?.isArchived === true;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await selectPack(ctx, packId);
    return '..';
  },
});

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.archive'), 'a', {
  hide: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    return pack?.isArchived === true;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await archivePack(ctx, packId);
    return true;
  },
});

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.restore'), 'r', {
  hide: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    const pack = await Pack.findById(packId);
    return pack?.isArchived === false;
  },
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await restorePack(ctx, packId);
    return true;
  },
});

menu.submenu(
  ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.delete'),
  'd',
  deleteConfirmMenu,
);

menu.navigate(ctx => ctx.i18n.t('menu.packs_list.single_pack.actions.back'), '..');
