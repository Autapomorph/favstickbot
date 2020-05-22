const locales = {
  en: '🇺🇸',
  ru: '🇷🇺',
};

const translateStrings = {
  en: 'Select language',
  ru: 'Выберите язык',
};

const translateMessages = {
  en: `${locales.en} ${translateStrings.en}`,
  ru: `${locales.ru} ${translateStrings.ru}`,
};

module.exports = {
  locales,
  translateMessages,
};
