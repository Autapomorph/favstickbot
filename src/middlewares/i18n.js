import { I18n } from '@grammyjs/i18n';

import { resourcesPath, defaultLocale } from '../config/i18n.js';

export const i18n = new I18n({
  directory: resourcesPath,
  defaultLanguage: defaultLocale.code,
});
