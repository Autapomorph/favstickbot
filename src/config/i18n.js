import { fileURLToPath } from 'node:url';

import 'dayjs/locale/en.js';
import 'dayjs/locale/ru.js';

export const locales = {
  en: {
    englishName: 'English',
    name: 'English',
    code: 'en',
    symbol: '🇺🇸',
  },
  ru: {
    englishName: 'Russian',
    name: 'Русский',
    code: 'ru',
    symbol: '🇷🇺',
  },
};

export const defaultLocale = locales.en;

export const resourcesPath = fileURLToPath(new URL('../../locales', import.meta.url));
