import * as replies from '../replies.js';
import { validateNameLength, validateNameSymbols } from '../../../../utils/packs/validate.js';
import { PACK_TYPES } from '../../../../utils/packs/packTypes.js';
import { match } from '../../../../utils/i18n/match.js';

export const validatePackType = async (ctx, type) => {
  const isStatic = Boolean(match(PACK_TYPES.STATIC)(type, ctx));
  const isAnimated = Boolean(match(PACK_TYPES.ANIMATED)(type, ctx));

  // None of pack types was chosen (none of keyboard btns was clicked)
  if (!isStatic && !isAnimated) {
    await replies.replyErrorPackType(ctx);
    return false;
  }

  return true;
};

export const validatePackTitle = async (ctx, title) => {
  if (!validateNameLength(title)) {
    await replies.replyErrorTitleTooLong(ctx);
    return false;
  }
  return true;
};

export const validatePackName = async (ctx, name) => {
  if (!validateNameLength(name)) {
    await replies.replyErrorNameTooLong(ctx);
    return false;
  }

  if (!validateNameSymbols(name)) {
    await replies.replyErrorNameInvalid(ctx);
    return false;
  }

  return true;
};
