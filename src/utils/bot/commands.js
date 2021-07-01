const list =
  telegram =>
  async ({ scope, language }) => {
    return telegram.getMyCommands({ scope, language_code: language });
  };

const register =
  telegram =>
  async ({ commands, scope, language }) => {
    return telegram.setMyCommands(commands, { scope, language_code: language });
  };

const unregister =
  telegram =>
  async ({ scope, language }) => {
    return telegram.deleteMyCommands({ scope, language_code: language });
  };

module.exports = {
  list,
  register,
  unregister,
};
