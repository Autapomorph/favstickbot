const Pack = require('../../../../../models/Pack');
const { packLinkPrefix } = require('../../../../../config');
const packPostfix = require('../../../../../utils/packs/postfix');
const escapeHTML = require('../../../../../utils/common/escapeHTML');

const getMenuBody = async ctx => {
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

module.exports = {
  getMenuBody,
};
