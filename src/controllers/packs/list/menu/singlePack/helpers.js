import { Pack } from '../../../../../models/Pack.js';
import { packLinkPrefix } from '../../../../../config/packs.js';
import * as packPostfix from '../../../../../utils/packs/postfix.js';
import { escapeHTML } from '../../../../../utils/common/escapeHTML.js';

export const getMenuBody = async ctx => {
  const packId = packPostfix.pad(ctx.match[1], ctx.botInfo.username);
  const pack = await Pack.findById(packId);
  const text = ctx.i18n.t('menu.packs_list.single_pack.body', {
    title: escapeHTML(pack.title),
    link: `${packLinkPrefix}${pack.name}`,
  });
  return {
    text,
    parse_mode: 'HTML',
  };
};
