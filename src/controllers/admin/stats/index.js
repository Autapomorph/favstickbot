const hi = require('human-interval');

const User = require('../../../models/User');
const Pack = require('../../../models/Pack');
const Sticker = require('../../../models/Sticker');
const Session = require('../../../models/Session');

module.exports = async ctx => {
  const resourceKeyReply = 'operation.stats.reply';
  const { commandParts } = ctx.state;
  const thresholdArgs = commandParts.args?.trim();
  const hiParsed = Math.abs(hi(thresholdArgs));

  let thresholdDate;
  let thresholdDateLocalized;
  if (Number.isInteger(hiParsed)) {
    thresholdDate = new Date(Date.now() - hiParsed);
    thresholdDate = new Date(
      Date.UTC(thresholdDate.getFullYear(), thresholdDate.getMonth(), thresholdDate.getDate()),
    );
    thresholdDateLocalized = thresholdDate?.toLocaleDateString(ctx.i18n.locale());
  }

  const thresholdDateFilter = thresholdDate && { createdAt: { $gt: thresholdDate } };
  const [usersResult, packsResult, stickersResult, sessionsResult] = await Promise.allSettled([
    User.countDocuments(thresholdDateFilter),
    Pack.countDocuments(thresholdDateFilter),
    Sticker.countDocuments(thresholdDateFilter),
    Session.countDocuments(),
  ]);

  const resultMap = [
    {
      field: 'users',
      result: usersResult,
    },
    {
      field: 'packs',
      result: packsResult,
    },
    {
      field: 'stickers',
      result: stickersResult,
    },
    {
      field: 'sessions',
      result: sessionsResult,
    },
  ];

  const sinceResourceKey = thresholdDate
    ? `${resourceKeyReply}.ok.since`
    : `${resourceKeyReply}.ok.total`;
  let replyText = ctx.i18n.t(sinceResourceKey, {
    date: thresholdDateLocalized,
  });

  replyText += resultMap.reduce((acc, cv) => {
    let fieldString = ctx.i18n.t(`${resourceKeyReply}.helpers.${cv.field}`);

    if (cv.result.status === 'fulfilled') {
      fieldString += ` <b>${cv.result.value}</b>`;
    } else {
      fieldString += ` ${ctx.i18n.t(`${resourceKeyReply}.error.fetch_failed`)}`;
    }

    return `${acc}\n${fieldString}`;
  }, '');

  return ctx.replyWithHTML(replyText);
};
