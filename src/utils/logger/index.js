const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const SentryTransport = require('./transports/Sentry');

const { isProd, name, version } = require('../index');

const { npm_package_name: npmPackageName, npm_package_version: npmPackageVersion } = process.env;

const { format } = winston;
const { combine, errors, align, colorize, timestamp, splat, printf } = format;

const formatErrorText = format(info => {
  const { message, stack, description } = info;
  return {
    ...info,
    // eslint-disable-next-line no-nested-ternary
    message: stack ? (description ? `${description}\n${stack}` : stack) : message,
  };
});

const formatErrorSentry = format(info => {
  const { message, stack, description, sentry } = info;

  if (sentry === false) {
    return false;
  }

  return {
    ...info,
    message: stack && description ? `${description}\n${message}` : message,
  };
});

// eslint-disable-next-line no-control-regex
const decolorizeRegex = /\u001b\[[0-9]{1,2}m/g;
const decolorize = format(info => {
  const { message } = info;
  return {
    ...info,
    message: message?.replace(decolorizeRegex, ''),
  };
});

const logger = winston.createLogger({
  format: errors({ stack: true }),
  transports: [
    new winston.transports.Console({
      level: isProd ? 'info' : 'debug',
      format: combine(
        formatErrorText(),
        timestamp({ format: 'DD/MM/YYYY HH:mm:ss ZZ' }),
        align(),
        colorize(),
        splat(),
        printf(({ timestamp: time, level, message }) => {
          return `[${time}] [${level}] ${message}`;
        }),
      ),
    }),
    new SentryTransport({
      level: 'error',
      silent: !isProd,
      sentry: {
        dsn: process.env.SENTRY_DSN,
        release: `${npmPackageName ?? name}@${npmPackageVersion ?? version}`,
        normalizeDepth: 10,
        beforeBreadcrumb: breadcrumb =>
          breadcrumb.category === 'http' || breadcrumb.type === 'http' ? null : breadcrumb,
      },
      format: formatErrorSentry(),
    }),
  ],
});

if (!process.env.VERCEL) {
  logger.add(
    new winston.transports.DailyRotateFile({
      level: 'debug',
      dirname: path.resolve(__dirname, '../../../logs'),
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      format: combine(
        formatErrorText(),
        timestamp({ format: 'DD/MM/YYYY HH:mm:ss ZZ' }),
        decolorize(),
        splat(),
        printf(({ timestamp: time, level, message }) => {
          return `[${time}] [${level}] ${message}`;
        }),
      ),
    }),
  );
}

module.exports = logger;
