import fetchToCurl from 'fetch-to-curl';
import clipboardy from 'clipboardy';
import open from 'open';

import { TELEGRAM_API } from '../constants.js';

export const getWebhookCommand = {
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
    y.option('open', {
      description: 'Open in browser',
      alias: 'o',
      type: 'boolean',
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
    const GET_WEBHOOK_INFO_METHOD_URL = `${BOT_API_URL}/getWebhookInfo`;

    if (argv.curl) {
      const curlString = fetchToCurl(GET_WEBHOOK_INFO_METHOD_URL);
      if (!argv.silent) console.log(curlString);
      return argv.copy ? clipboardy.write(curlString) : undefined;
    }

    if (argv.open) {
      return open(GET_WEBHOOK_INFO_METHOD_URL);
    }

    try {
      const response = await fetch(GET_WEBHOOK_INFO_METHOD_URL).then(res => res.json());
      if (!response.ok) throw new Error(response.description);

      if (!argv.silent) {
        console.dir(response.result);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
