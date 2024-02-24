/* eslint-disable max-classes-per-file */
import Sentry from '@sentry/node';
import TransportStream from 'winston-transport';
import { LEVEL } from 'triple-beam';

// Map Sentry error severity types to Winston types
const DEFAULT_LEVELS_MAP = {
  silly: 'debug',
  verbose: 'debug',
  info: 'info',
  debug: 'debug',
  warn: 'warning',
  error: 'error',
};

class ExtendedError extends Error {
  constructor(info) {
    super(info.message);

    this.name = info.name || 'Error';
    if (info.stack) {
      this.stack = info.stack;
    }
  }
}

const isObject = obj => typeof obj === 'function' || (typeof obj === 'object' && Boolean(obj));

const isException = level => level === 'fatal' || level === 'error';

const setLevelsMap = options => {
  if (!options) {
    return DEFAULT_LEVELS_MAP;
  }

  const customLevelsMap = Object.keys(options).reduce((acc, winstonSeverity) => {
    acc[winstonSeverity] = options[winstonSeverity];
    return acc;
  }, {});

  return {
    ...DEFAULT_LEVELS_MAP,
    ...customLevelsMap,
  };
};

const getDefaults = options => {
  return {
    ...options,
    dsn: options?.dsn || process.env.SENTRY_DSN || '',
    serverName: options?.serverName || 'winston-transport-sentry-node',
    environment:
      options?.environment ||
      process.env.SENTRY_ENVIRONMENT ||
      process.env.NODE_ENV ||
      'production',
    debug: options?.debug || Boolean(process.env.SENTRY_DEBUG) || false,
    sampleRate: options?.sampleRate || 1.0,
    maxBreadcrumbs: options?.maxBreadcrumbs || 100,
  };
};

export class SentryTransport extends TransportStream {
  constructor(options) {
    super(options);
    this.levelsMap = setLevelsMap(options?.levelsMap);
    this.silent = Boolean(options?.silent ?? false);
    Sentry.init(getDefaults(options?.sentry ?? {}));
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (this.silent) return callback();

    const { message, tags, user, contexts } = info;
    const winstonLevel = info[LEVEL];
    const sentryLevel = this.levelsMap[winstonLevel];

    Sentry.withScope(scope => {
      if (isObject(user)) {
        scope.setUser(user);
      }

      if (isObject(tags)) {
        scope.setTags(tags);
      }

      if (isObject(contexts)) {
        scope.setTags(tags);
        Object.keys(contexts).forEach(contextKey => {
          scope.setContext(contextKey, contexts[contextKey]);
        });
      }

      if (isException(sentryLevel)) {
        const error = message instanceof Error ? message : new ExtendedError(info);
        Sentry.captureException(error);
        return;
      }

      Sentry.captureMessage(message, sentryLevel);
    });

    return callback();
  }

  end(...args) {
    Sentry.flush().then(() => {
      super.end(...args);
    });
  }
}
