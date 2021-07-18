const fetch = require('node-fetch');
const { fetchToCurl } = require('fetch-to-curl');
const clipboardy = require('clipboardy');

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
    });
    y.option('curl', {
      description: 'Print as cURL request',
      type: 'boolean',
    });
    y.option('copy', {
      description: 'Copy cURL request to clipboard',
      alias: 'c',
      type: 'boolean',
      default: true,
    });
    y.option('silent', {
      description: 'Do not print to console',
      alias: 's',
      type: 'boolean',
    });
    y.version();
    y.help();
    y.alias('version', 'v');
    y.alias('help', 'h');
  },
  handler: async argv => {
    const BOT_API_URL = `${TELEGRAM_API}/bot${argv.token}`;
    const DELETE_WEBHOOK_METHOD_URL = `${BOT_API_URL}/deleteWebhook`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        drop_pending_updates: argv.dropUpdates,
      }),
    };

    if (argv.curl) {
      const curlString = fetchToCurl(DELETE_WEBHOOK_METHOD_URL, requestOptions);
      if (!argv.silent) console.log(curlString);
      return argv.copy ? clipboardy.write(curlString) : undefined;
    }

    try {
      const response = await fetch(DELETE_WEBHOOK_METHOD_URL, requestOptions).then(res =>
        res.json(),
      );
      if (!response.ok) throw new Error(response.description);

      if (!argv.silent) {
        console.dir(response);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
