const packLinkRegex = /addstickers\/(?<packName>.+)/;

const isTextLink = entity => entity.type === 'text_link';

const isPackLink = entity => packLinkRegex.test(entity.url);

const getPackNameFromURL = url => {
  const reExecRes = packLinkRegex.exec(url);
  return reExecRes?.groups.packName;
};

export const hasPackLink = async (ctx, next) => {
  const { entities } = ctx.message;

  if (!entities?.length) {
    return;
  }

  const packLinkEntity = entities.filter(isTextLink).find(isPackLink);
  if (!packLinkEntity) {
    return;
  }

  const packName = getPackNameFromURL(packLinkEntity.url);
  if (!packName) {
    return;
  }

  ctx.state.packToRestoreName = packName;
  return next();
};
