const User = require('../../../models/User');
const Pack = require('../../../models/Pack');
const Sticker = require('../../../models/Sticker');
const Session = require('../../../models/Session');
const { getThresholdDates, getThresholdFilter, reduceReplyText } = require('./helpers');

module.exports = async ctx => {
  const dates = getThresholdDates(ctx);
  const thresholdDatesFilter = getThresholdFilter(dates);

  const [usersResult, packsResult, stickersResult, sessionsResult] = await Promise.allSettled([
    User.countDocuments(thresholdDatesFilter),
    Pack.countDocuments(thresholdDatesFilter),
    Sticker.countDocuments(thresholdDatesFilter),
    Session.countDocuments(),
  ]);

  const responseConfig = [
    [
      { field: 'users', result: usersResult },
      { field: 'packs', result: packsResult },
      { field: 'stickers', result: stickersResult },
    ],
    [{ field: 'sessions', result: sessionsResult }],
  ];

  const replyText = reduceReplyText(ctx, dates, responseConfig);
  return ctx.replyWithHTML(replyText);
};
