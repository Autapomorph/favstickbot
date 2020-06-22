const winston = require('winston');
const SentryTransport = require('winston-transport-sentry-node').default;

const { isProd } = require('./index');

const { SENTRY_DSN } = process.env;

const { format } = winston;
const { combine, errors, align, colorize, timestamp, splat, simple, printf } = format;

const logger = winston.createLogger({
  format: errors({ stack: true }),
  transports: [
    new winston.transports.Console({
      level: isProd ? 'error' : 'debug',
      format: combine(
        timestamp({ format: 'DD/MM/YYYY HH:mm:ss ZZ' }),
        align(),
        colorize(),
        splat(),
        simple(),
        printf(({ timestamp: time, level, message, stack }) => {
          const stackTrace = stack ? `\n${stack}` : '';
          return `[${time}] [${level}] ${message}${stackTrace}`;
        }),
      ),
    }),
    new SentryTransport({
      level: 'error',
      silent: !isProd,
      sentry: {
        dsn: SENTRY_DSN,
      },
    }),
  ],
});

module.exports = logger;
