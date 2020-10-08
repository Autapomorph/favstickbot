const validateTelegramErrorType = (errorRegex, error) => {
  if (!errorRegex) return false;
  if (!error || (typeof error !== 'string' && typeof error !== 'object')) return false;
  if (typeof error === 'object' && !error.description) return false;

  const errorToTest = typeof error === 'object' ? error.description : error;

  if (Array.isArray(errorRegex)) {
    return errorRegex.some(re => re.test(errorToTest));
  }

  return errorRegex.test(errorToTest);
};

module.exports = validateTelegramErrorType;
