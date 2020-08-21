const getPackListText = (ctx, packs) =>
  packs.length ? ctx.i18n.t('cmd.packs.reply.list') : ctx.i18n.t('cmd.packs.reply.empty');

module.exports = {
  getPackListText,
};
