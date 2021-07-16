const fetch = require('node-fetch');

const { TELEGRAM_API } = require('../constants');
const createWebhookPath = require('../../src/utils/bot/createWebhookPath');

module.exports = {
  command: 'set [url]',
  description: 'Set webhook URL',
  builder: y => {
    y.positional('url', {
      description: 'Webhook URL to set',
      type: 'string',
      default: process.env.WEBHOOK_DOMAIN,
      defaultDescription: 'Generated from process.env.WEBHOOK_DOMAIN and bot token',
    });
    y.option('token', {
      description: 'Bot token',
      alias: 't',
      type: 'string',
      default: process.env.BOT_TOKEN,
      defaultDescription: 'process.env.BOT_TOKEN',
      demandOption: 'Please provide bot token',
    });
    y.option('maxConnections', {
      description:
        'Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100',
      alias: 'mc',
      type: 'number',
      default: 40,
      coerce: maxConnections => {
        if (!Number.isFinite(maxConnections)) return 40;
        return maxConnections < 1 ? 1 : Math.min(maxConnections, 100);
      },
    });
    y.option('dropUpdates', {
      description: 'Drop pending updates',
      alias: 'd',
      type: 'boolean',
      default: false,
    });
    y.option('print', {
      description: 'Print results',
      type: 'boolean',
      default: true,
    });
    y.version();
    y.alias('version', 'v');
    y.help();
    y.alias('help', 'h');
  },
  handler: async argv => {
    const BOT_API_URL = `${TELEGRAM_API}/bot${argv.token}`;
    const GET_WEBHOOK_INFO_METHOD_URL = `${BOT_API_URL}/getWebhookInfo`;
    let SET_WEBHOOK_METHOD_URL = `${BOT_API_URL}/setWebhook`;

    SET_WEBHOOK_METHOD_URL += `?url=${argv.url}/bots/${createWebhookPath(argv.token)}`;
    if (argv.maxConnections) SET_WEBHOOK_METHOD_URL += `&max_connections=${argv.maxConnections}`;
    if (argv.drop) SET_WEBHOOK_METHOD_URL += `&drop_pending_updates=${argv.drop}`;

    try {
      const setWebhookResponse = await fetch(SET_WEBHOOK_METHOD_URL).then(res => res.json());
      if (!setWebhookResponse.ok) throw new Error(setWebhookResponse.description);
      if (argv.print) {
        console.dir(setWebhookResponse);
      }

      const getWebhookResponse = await fetch(GET_WEBHOOK_INFO_METHOD_URL).then(res => res.json());
      if (!getWebhookResponse.ok) throw new Error(getWebhookResponse.description);
      if (argv.print) {
        console.dir(getWebhookResponse.result);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
