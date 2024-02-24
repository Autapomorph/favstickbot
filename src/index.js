import 'dotenv/config';

import * as database from './database.js';
import { bot } from './bot.js';
import { WEBHOOK_OPTIONS } from './config/webhook.js';
import { logger } from './utils/logger/index.js';
import { isProd } from './utils/index.js';

const { NODE_ENV, MONGODB_URI, WEBHOOK_ENABLE } = process.env;

logger.info(`Application is running in ${NODE_ENV} mode`);

if (!isProd) {
  logger.info('Logging initialized at debug level');
}

database.connect(MONGODB_URI).then(() => {
  launchBot(bot);
});

async function launchBot(botInstance) {
  if (WEBHOOK_ENABLE === 'true') {
    await botInstance.launch({
      webhook: WEBHOOK_OPTIONS,
    });
    const webhookStatus = await botInstance.telegram.getWebhookInfo();
    logger.info('Bot started in webhook mode');
    logger.debug('Webhook status:\n%O', webhookStatus);
  } else {
    await botInstance.launch();
    logger.info('Bot started in polling mode');
  }
}

async function shutdown(signal) {
  logger.info(`Shutting down${signal ? ` (${signal})` : ''}`);
  bot.stop(signal);
  await database.disconnect();
  process.exit(0);
}

process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGTERM', shutdown);
