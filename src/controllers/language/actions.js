const startController = require('../start');
const { locales } = require('../../config');

const setLanguage = async ctx => {
  const { user } = ctx.session;

  const locale = locales[ctx.match.groups.langCode];
  if (locale) {
    ctx.answerCbQuery(locale.symbol);
    ctx.i18n.locale(locale.code);
    user.locale = locale.code;
    await user.save();
  }

  return startController(ctx);
};

module.exports = {
  setLanguage,
};
