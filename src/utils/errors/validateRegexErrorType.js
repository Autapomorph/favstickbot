const validateTelegramErrorType = (errorRegex, error) => {
  if (!error) {
    return false;
  }

  if (typeof error === 'object') {
    return errorRegex.test(error.description);
  }

  if (typeof error === 'string') {
    return errorRegex.test(error);
  }

  return false;
};

module.exports = validateTelegramErrorType;
