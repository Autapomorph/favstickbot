import { getMainKeyboard } from '../../keyboards/main.js';
import { getUserName } from '../../utils/users/getUserName.js';

export const start = async ctx => {
  return ctx.sendMessage(
    ctx.i18n.t('cmd.start.reply', {
      name: getUserName(ctx.from),
    }),
    {
      ...getMainKeyboard(ctx),
      parse_mode: 'HTML',
    },
  );
};
