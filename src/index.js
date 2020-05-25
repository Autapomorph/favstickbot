require('dotenv').config();

const bot = require('./bot');
const database = require('./database');
const WEBHOOK_OPTIONS = require('./config/webhook');
const logger = require('./utils/logger');
const { isProd } = require('./utils');

const { MONGODB_URI, WEBHOOK_DOMAIN } = process.env;

if (!isProd) {
  logger.debug('Logging initialized at debug level');
}

database.connect(MONGODB_URI);
database.addConnectListener(async () => {
  if (WEBHOOK_DOMAIN) {
    return launchWebhookMode(bot);
  }

  return launchPollingMode(bot);
});

async function launchWebhookMode(botInstance) {
  await botInstance.launch({
    webhook: WEBHOOK_OPTIONS,
  });

  const webhookStatus = await botInstance.telegram.getWebhookInfo();
  logger.info('Bot started in webhook mode');
  logger.debug('Webhook status:\n%O', webhookStatus);
}

async function launchPollingMode(botInstance) {
  await botInstance.launch();
  logger.info('Bot started in polling mode');
}
