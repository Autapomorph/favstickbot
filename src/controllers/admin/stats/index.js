const User = require('../../../models/User');
const Pack = require('../../../models/Pack');
const Sticker = require('../../../models/Sticker');
const Session = require('../../../models/Session');
const {
  getThresholdDates,
  getLocalizedDates,
  getThresholdFilter,
  getReplyText,
  getPeriodKey,
} = require('./helpers');

module.exports = async ctx => {
  const dates = getThresholdDates(
    ctx.state.commandParts?.args?.trim(),
    ctx.message.reply_to_message,
  );
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
  const replyText = getReplyText(ctx.i18n.t.bind(ctx.i18n), responseConfig);
  return ctx.replyWithHTML(replyText);
};
