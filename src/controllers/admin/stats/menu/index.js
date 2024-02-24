import { MenuTemplate } from 'telegraf-inline-menu';
import { ForbiddenError } from '@casl/ability';

import { stats as statsController } from '../index.js';
import { getMenuBody, getMenuChoices } from './helpers.js';

export const menu = new MenuTemplate(getMenuBody);

menu.choose('show', getMenuChoices, {
  do: async ctx => {
    ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', 'Stats');
    await statsController(ctx);
    return true;
  },
  columns: 3,
});

menu.navigate(ctx => ctx.i18n.t('menu.admin.stats.actions.back'), '..');
