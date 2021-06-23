const { MenuTemplate } = require('telegraf-inline-menu');

const actions = require('../../../actions');
const { getMenuBody } = require('./helpers');
const packPostfix = require('../../../../../../utils/packs/postfix');

const menu = new MenuTemplate(getMenuBody);

menu.interact(ctx => ctx.i18n.t('menu.packs_list.single_pack.delete_confirm.actions.yes'), 'y', {
  do: async ctx => {
    const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
    await actions.delete(ctx, packId);
    return true;
  },
});

menu.navigate(ctx => ctx.i18n.t('menu.packs_list.single_pack.delete_confirm.actions.back'), '..');

module.exports = menu;
