import updateLogger from 'telegraf-update-logger';

import { logger } from '../utils/logger/index.js';

export const logUpdate = updateLogger({ colors: true, log: logger.debug });
