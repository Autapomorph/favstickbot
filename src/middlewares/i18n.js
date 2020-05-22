const path = require('path');
const I18n = require('telegraf-i18n');

const i18n = new I18n({
  directory: path.resolve(process.cwd(), 'src', 'locales'),
  defaultLanguage: 'en',
  useSession: true,
});

i18n.middleware();

module.exports = i18n.middleware();
