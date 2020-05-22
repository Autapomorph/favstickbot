const packLinkRegex = /addstickers\/(?<packName>.+)/;
const testEntityType = type => type === 'text_link';
const getPackNameFromURL = url => {
  const reExecRes = packLinkRegex.exec(url);
  return reExecRes && reExecRes.groups.packName;
};

module.exports = async (ctx, next) => {
  const { entities } = ctx.message;

  if (!entities) {
    return;
  }

  const packLinkEntities = entities.filter(entity => testEntityType(entity.type));
  if (!packLinkEntities.length) {
    return;
  }

  const packName = getPackNameFromURL(packLinkEntities[0].url);
  if (!packName) {
    return;
  }

  ctx.state.packName = packName;
  return next();
};
