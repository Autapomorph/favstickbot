require('dotenv').config();

const bot = require('./bot');
const database = require('./database');
const WEBHOOK_OPTIONS = require('./config/webhook');
const logger = require('./utils/logger');
const { isProd } = require('./utils');

const { NODE_ENV, MONGODB_URI, WEBHOOK_ENABLE } = process.env;

logger.info(`Application is running in ${NODE_ENV} mode`);

if (!isProd) {
  logger.info('Logging initialized at debug level');
}

database.connect(MONGODB_URI).then(() => launchBot(bot));

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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
