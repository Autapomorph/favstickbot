const { packNameMaxLength } = require('../../config/packs');

const validateNameLength = name => name && name.length > 0 && name.length <= packNameMaxLength;

const validateNameSymbols = name => name && /^(?!.*__)[a-zA-Z]\w*$/.test(name);

module.exports = {
  validateNameLength,
  validateNameSymbols,
};
