import { MenuTemplate } from 'telegraf-inline-menu';

import { deletePack } from '../../../actions.js';
import { getMenuBody } from './helpers.js';
import * as packPostfix from '../../../../../../utils/packs/postfix.js';

export const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.delete_confirm.actions.yes'), 'y', {
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await deletePack(ctx, packId);
    return true;
  },
});

menu.navigate(ctx => ctx.i18n.t('menu.packs_list.single_pack.delete_confirm.actions.back'), '..');
