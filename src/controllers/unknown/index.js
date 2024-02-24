import { getMainKeyboard } from '../../keyboards/main.js';

export const unknown = async ctx => {
  return ctx.sendMessage(ctx.i18n.t('cmd.unknown.reply'), {
    ...getMainKeyboard(ctx),
    parse_mode: 'HTML',
  });
};
