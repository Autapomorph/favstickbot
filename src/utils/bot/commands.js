export const list =
  telegram =>
  async ({ scope, language }) => {
    return telegram.getMyCommands({ scope, language_code: language });
  };

export const register =
  telegram =>
  async ({ commands, scope, language }) => {
    return telegram.setMyCommands(commands, { scope, language_code: language });
  };

export const unregister =
  telegram =>
  async ({ scope, language }) => {
    return telegram.deleteMyCommands({ scope, language_code: language });
  };
