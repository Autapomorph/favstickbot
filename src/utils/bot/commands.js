const list = telegram => async (scope, language) => {
  // TODO: use `telegram.getMyCommands` after `telegraf` update:
  // return telegram.getMyCommands(scope, language);
  return telegram.callApi('getMyCommands', { scope, language_code: language });
};

const register = telegram => async (commands, scope, language) => {
  // TODO: use `telegram.setMyCommands` after `telegraf` update:
  // return telegram.setMyCommands(commands, scope, language);
  return telegram.callApi('setMyCommands', { commands, scope, language_code: language });
};

const unregister = telegram => async (scope, language) => {
  // TODO: use `telegram.deleteMyCommands` after `telegraf` update:
  // return telegram.deleteMyCommands(scope, language);
  return telegram.callApi('deleteMyCommands', { scope, language_code: language });
};

module.exports = {
  list,
  register,
  unregister,
};
