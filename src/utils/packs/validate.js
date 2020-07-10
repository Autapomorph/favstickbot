const { packNameMaxLength } = require('../../config');

const validateNameLength = name => {
  return name && name.length > 0 && name.length <= packNameMaxLength;
};

const validateNameSymbols = name => {
  return name && /^(?!.*__)[a-zA-Z]\w*$/.test(name);
};

const validateOwner = (pack, user) => {
  return String(pack.owner) === String(user.id);
};

module.exports = {
  validateNameLength,
  validateNameSymbols,
  validateOwner,
};
