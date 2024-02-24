import { User } from '../../../models/User.js';
import { Pack } from '../../../models/Pack.js';
import { Sticker } from '../../../models/Sticker.js';
import { Session } from '../../../models/Session.js';
import {
  getThresholdDates,
  getLocalizedDates,
  getThresholdFilter,
  getReplyText,
  getPeriodKey,
} from './helpers.js';

export const stats = async ctx => {
  const dates = getThresholdDates(ctx);
  const thresholdDatesFilter = getThresholdFilter(dates);

  const [usersResult, packsResult, stickersResult, sessionsResult] = await Promise.allSettled([
    User.countDocuments(thresholdDatesFilter),
    Pack.countDocuments(thresholdDatesFilter),
    Sticker.countDocuments(thresholdDatesFilter),
    Session.countDocuments(),
  ]);

  const responseConfig = [
    {
      header: {
        key: `period.${getPeriodKey(dates)}`,
        resource: { dates: getLocalizedDates(dates, ctx.i18n.locale()) },
      },
      fields: [
        { key: 'users', result: usersResult },
        { key: 'packs', result: packsResult },
        { key: 'stickers', result: stickersResult },
      ],
    },
    {
      header: { key: 'current' },
      fields: [{ key: 'sessions', result: sessionsResult }],
    },
  ];
  const replyText = getReplyText(ctx, responseConfig);
  return ctx.sendMessage(replyText, { parse_mode: 'HTML' });
};
