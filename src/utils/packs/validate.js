const { packNameMaxLength } = require('../../config');

const validateNameLength = name => {
  return name && name.length > 0 && name.length <= packNameMaxLength;
};

const validateNameSymbols = name => {
  return name && /^(?!.*__)[a-zA-Z]\w*$/.test(name);
};

module.exports = {
  validateNameLength,
  validateNameSymbols,
};
