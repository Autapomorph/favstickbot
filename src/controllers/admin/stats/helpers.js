const hi = require('human-interval');
const chrono = require('chrono-node');

const MILLIS_IN_SEC = 1000;

const getDateUTC = date => {
  if (!date) return undefined;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

const getLocalizedDate = (date, locale) => {
  if (!date || !locale) return undefined;
  return date.toLocaleDateString(locale);
};

const getThresholdDates = ctx => {
  const thresholdArgs = ctx.state.commandParts?.args?.trim();

  const replyTo = ctx.message.reply_to_message;
  if (replyTo?.date !== undefined) {
    return {
      from: getDateUTC(new Date(replyTo.date * MILLIS_IN_SEC)),
      to: undefined,
    };
  }

  const chronoParsed = chrono.parse(thresholdArgs, new Date(), { forwardDate: false })[0];
  if (chronoParsed) {
    const { start, end } = chronoParsed;
    const today = getDateUTC(new Date());
    const from = getDateUTC(start?.date());
    const to = getDateUTC(end?.date());
    return {
      from: from <= today ? from : undefined,
      to: to <= today ? to : undefined,
    };
  }

  const hiParsed = Math.abs(hi(thresholdArgs));
  if (Number.isInteger(hiParsed)) {
    return {
      from: getDateUTC(new Date(Date.now() - hiParsed)),
      to: undefined,
    };
  }

  return {
    from: undefined,
    to: undefined,
  };
};

const getThresholdFilter = dates => {
  const { from, to } = dates;
  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gt = from;
    if (to) createdAt.$lt = to;
    return { createdAt };
  }
};

const reduceReplyText = (ctx, dates, responseConfig) => {
  const { from, to } = dates;
  const locale = ctx.i18n.locale();

  let periodKey;
  if (from && to) {
    periodKey = 'fromTo';
  } else if (from) {
    periodKey = 'since';
  } else if (from) {
    periodKey = 'until';
  } else {
    periodKey = 'total';
  }

  let replyText = ctx.i18n.t(`operation.stats.reply.ok.period.${periodKey}`, {
    dates: {
      from: getLocalizedDate(from, locale),
      to: getLocalizedDate(to, locale),
    },
  });

  responseConfig.forEach(config => {
    replyText += '\n';
    replyText += config.reduce((acc, cv) => {
      let fieldString = `${ctx.i18n.t(`operation.stats.reply.ok.${cv.field}`)}:`;

      if (cv.result.status === 'fulfilled') {
        fieldString += ` <b>${cv.result.value}</b>`;
      } else {
        fieldString += ` ${ctx.i18n.t('operation.stats.reply.error.fetch_failed')}`;
      }

      return `${acc}\n${fieldString}`;
    }, '');
  });

  return replyText;
};

module.exports = {
  getThresholdDates,
  getThresholdFilter,
  getDateUTC,
  getLocalizedDate,
  reduceReplyText,
};
