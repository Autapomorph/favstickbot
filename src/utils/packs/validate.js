const { packNameMaxLength } = require('../../config/packs');

const validateNameLength = name => name && name.length > 0 && name.length <= packNameMaxLength;

const validateNameSymbols = name => name && /^(?!.*__)[a-zA-Z]\w*$/.test(name);

const validateOwner = (ownerId, userId) => String(ownerId) === String(userId);

module.exports = {
  validateNameLength,
  validateNameSymbols,
  validateOwner,
};
