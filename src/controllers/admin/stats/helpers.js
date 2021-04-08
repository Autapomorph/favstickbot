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

const getLocalizedDates = (dates, locale) => {
  if (!dates || !locale) return undefined;
  return Object.entries(dates).reduce((acc, [key, val]) => {
    acc[key] = getLocalizedDate(val, locale);
    return acc;
  }, {});
};

const getThresholdDates = (thresholdArgs, replyTo) => {
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

const getReplyText = (t, responseConfig) => {
  let replyText = '';

  responseConfig.forEach((config, i) => {
    if (i > 0) {
      replyText += '\n\n';
    }

    const { header, fields } = config;
    replyText += t(`operation.stats.reply.ok.${header.key}`, header.resource);
    replyText += fields.reduce((acc, cv) => {
      let fieldString = `${t(`operation.stats.reply.ok.${cv.key}`)}:`;

      if (cv.result.status === 'fulfilled') {
        fieldString += ` <b>${cv.result.value}</b>`;
      } else {
        fieldString += ` ${t('operation.stats.reply.error.fetch_failed')}`;
      }

      return `${acc}\n${fieldString}`;
    }, '');
  });

  return replyText;
};

const getPeriodKey = ({ from, to }) => {
  if (from && to) return 'fromTo';
  if (from) return 'since';
  if (to) return 'until';
  return 'total';
};

module.exports = {
  getThresholdDates,
  getThresholdFilter,
  getDateUTC,
  getLocalizedDate,
  getLocalizedDates,
  getReplyText,
  getPeriodKey,
};
