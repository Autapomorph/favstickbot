const fetch = require('node-fetch');
const open = require('open');

const { TELEGRAM_API } = require('../constants');

module.exports = {
  command: 'get',
  description: 'Get webhook info',
  builder: y => {
    y.option('token', {
      description: 'Bot token',
      alias: 't',
      type: 'string',
      default: process.env.BOT_TOKEN,
      defaultDescription: 'process.env.BOT_TOKEN',
      demandOption: 'Please provide bot token',
    });
    y.option('open', {
      description: 'Open in browser',
      alias: 'o',
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

    try {
      const response = await fetch(GET_WEBHOOK_INFO_METHOD_URL).then(res => res.json());
      if (!response.ok) throw new Error(response.description);

      if (argv.print) {
        console.dir(response.result);
      }

      if (argv.open) {
        return open(GET_WEBHOOK_INFO_METHOD_URL);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
