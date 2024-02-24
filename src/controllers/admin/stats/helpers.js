import hi from 'human-interval';
import * as chrono from 'chrono-node';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc.js';
import durationPlugin from 'dayjs/plugin/duration.js';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat.js';

dayjs.extend(utcPlugin);
dayjs.extend(durationPlugin);
dayjs.extend(localizedFormatPlugin);

const getReplyToDates = replyToDate => {
  return {
    from: dayjs.unix(replyToDate).utc().startOf('minute'),
    to: undefined,
  };
};

const getChronoDate = chronoComponent => {
  if (!chronoComponent) return undefined;

  const { knownValues } = chronoComponent;
  const { timezoneOffset, hour } = knownValues;

  const hasTimezoneOffset = Number.isInteger(timezoneOffset);
  const hasHours = Number.isInteger(hour);
  const startOfUnitType = hasHours ? 'minute' : 'day';

  const now = dayjs.utc();
  const date = dayjs(chronoComponent.date()).utc(!hasTimezoneOffset).startOf(startOfUnitType);
  return date.isBefore(now) ? date : undefined;
};

const getChronoDates = chronoParsed => {
  const { start, end } = chronoParsed;
  return {
    from: getChronoDate(start),
    to: getChronoDate(end),
  };
};

const getHumanIntervalDates = hiParsed => {
  const now = dayjs.utc();
  const msInDay = dayjs.duration(1, 'day').asMilliseconds();
  const startOfUnitType = hiParsed < msInDay ? 'minute' : 'day';
  return {
    from: now.subtract(hiParsed, 'ms').startOf(startOfUnitType),
    to: undefined,
  };
};

export const getThresholdDates = ctx => {
  const dateString = ctx.state.commandParts?.args?.trim() ?? ctx.match?.[1];
  const replyTo = ctx.message?.reply_to_message;

  if (replyTo?.date !== undefined) {
    return getReplyToDates(replyTo.date);
  }

  const chronoParsed = chrono.parse(dateString, new Date(), { forwardDate: false })[0];
  if (chronoParsed) {
    return getChronoDates(chronoParsed);
  }

  const hiParsed = Math.abs(hi(dateString));
  if (Number.isInteger(hiParsed)) {
    return getHumanIntervalDates(hiParsed);
  }

  return {
    from: undefined,
    to: undefined,
  };
};

export const getThresholdFilter = dates => {
  const { from, to } = dates;
  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gte = from;
    if (to) createdAt.$lte = to;
    return { createdAt };
  }
};

export const getReplyText = (ctx, responseConfig) => {
  let replyText = '';

  responseConfig.forEach((config, i) => {
    if (i > 0) {
      replyText += '\n\n';
    }

    const { header, fields } = config;
    replyText += ctx.i18n.t(`operation.stats.reply.ok.${header.key}`, header.resource);
    replyText += fields.reduce((acc, cv) => {
      let fieldString = `${ctx.i18n.t(`operation.stats.reply.ok.${cv.key}`)}:`;

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

export const getLocalizedDate = (date, locale) => {
  if (!date) return undefined;
  const format = date.hour() === 0 && date.minute() === 0 ? 'll' : 'lll UTC';
  return date.locale(locale).format(format);
};

export const getLocalizedDates = (dates, locale) => {
  if (!dates || !locale) return undefined;
  return Object.entries(dates).reduce((acc, [key, val]) => {
    acc[key] = getLocalizedDate(val, locale);
    return acc;
  }, {});
};

export const getPeriodKey = ({ from, to }) => {
  if (from && to) return 'from_to';
  if (from) return 'since';
  if (to) return 'until';
  return 'total';
};
