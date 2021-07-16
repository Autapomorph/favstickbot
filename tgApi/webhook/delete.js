const fetch = require('node-fetch');

const { TELEGRAM_API } = require('../constants');

module.exports = {
  command: 'delete',
  description: 'Delete webhook',
  builder: y => {
    y.option('token', {
      description: 'Bot token',
      alias: 't',
      type: 'string',
      default: process.env.BOT_TOKEN,
      defaultDescription: 'process.env.BOT_TOKEN',
      demandOption: 'Please provide bot token',
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
    let DELETE_WEBHOOK_METHOD_URL = `${BOT_API_URL}/deleteWebhook`;

    if (argv.drop) DELETE_WEBHOOK_METHOD_URL += `?drop_pending_updates=${argv.drop}`;

    try {
      const response = await fetch(DELETE_WEBHOOK_METHOD_URL).then(res => res.json());
      if (!response.ok) throw new Error(response.description);

      if (argv.print) {
        console.dir(response);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
