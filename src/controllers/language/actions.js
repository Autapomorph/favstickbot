const startController = require('../start');
const { locales } = require('../../config');

const setLanguage = async ctx => {
  const { user } = ctx.session;
  const { langCode } = ctx.match.groups;
  const localeSymbol = locales[langCode];

  if (localeSymbol) {
    ctx.answerCbQuery(localeSymbol);
    ctx.i18n.locale(langCode);
    user.locale = ctx.i18n.locale();
    await user.save();
  }

  return startController(ctx);
};

module.exports = {
  setLanguage,
};
