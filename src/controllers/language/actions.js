const startController = require('../start');
const { locales } = require('../../config');

const setLanguage = async ctx => {
  const { user } = ctx.session;
  const locale = ctx.match[1];
  const localeSymbol = locales[locale];

  if (localeSymbol) {
    ctx.answerCbQuery(localeSymbol);
    ctx.i18n.locale(locale);
    user.locale = ctx.i18n.locale();
    await user.save();
  }

  return startController(ctx);
};

module.exports = {
  setLanguage,
};
