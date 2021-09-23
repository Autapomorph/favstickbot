const replies = require('../replies');
const { validateNameLength, validateNameSymbols } = require('../../../../utils/packs/validate');
const PACK_TYPES = require('../../../../utils/packs/packTypes');
const match = require('../../../../utils/i18n/match');

const validatePackType = async (ctx, type) => {
  const isStatic = Boolean(match(PACK_TYPES.STATIC)(type, ctx));
  const isAnimated = Boolean(match(PACK_TYPES.ANIMATED)(type, ctx));

  // None of pack types was chosen (none of keyboard btns was clicked)
  if (!isStatic && !isAnimated) {
    await replies.replyErrorPackType(ctx);
    return false;
  }

  return true;
};

const validatePackTitle = async (ctx, title) => {
  if (!validateNameLength(title)) {
    await replies.replyErrorTitleTooLong(ctx);
    return false;
  }
  return true;
};

const validatePackName = async (ctx, name) => {
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

module.exports = {
  validatePackType,
  validatePackTitle,
  validatePackName,
};
