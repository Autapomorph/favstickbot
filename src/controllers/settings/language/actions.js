import { start as startController } from '../../start/index.js';
import { locales } from '../../../config/i18n.js';

export const setLanguage = async ctx => {
  const { user } = ctx.state;

  const locale = locales[ctx.match[1]];
  if (locale) {
    ctx.i18n.locale(locale.code);
    ctx.answerCbQuery(
      ctx.i18n.t('operation.settings.language.select.answer', {
        name: locale.name,
        symbol: locale.symbol,
      }),
    );
    user.settings.locale = locale.code;
    await user.save();
  }

  return startController(ctx);
};
