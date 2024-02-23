import fetchToCurl from 'fetch-to-curl';
import clipboardy from 'clipboardy';

import { TELEGRAM_API } from '../constants.js';
import createWebhookPath from '../../src/utils/bot/createWebhookPath.js';

export const setWebhookCommand = {
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
    y.option('ip_address', {
      description:
        'The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS',
      alias: 'ip',
      type: 'string',
    });
    y.option('maxConnections', {
      description:
        'Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100',
      alias: 'mc',
      type: 'number',
      coerce: maxConnections => {
        const minMaxConnections = 1;
        const maxMaxConnections = 100;
        if (!Number.isSafeInteger(maxConnections)) return undefined;
        return maxConnections < minMaxConnections
          ? undefined
          : Math.min(maxConnections, maxMaxConnections);
      },
    });
    y.option('allowedUpdates', {
      description: 'A JSON-serialized list of the update types you want your bot to receive',
      alias: 'au',
      type: 'array',
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
    const SET_WEBHOOK_METHOD_URL = `${BOT_API_URL}/setWebhook`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `${argv.url}/bots/${createWebhookPath(argv.token)}`,
        ip_address: argv.ip,
        max_connections: argv.maxConnections,
        allowed_updates: argv.allowedUpdates,
        drop_pending_updates: argv.dropUpdates,
      }),
    };

    if (argv.curl) {
      const curlString = fetchToCurl(SET_WEBHOOK_METHOD_URL, requestOptions);
      if (!argv.silent) console.log(curlString);
      return argv.copy ? clipboardy.write(curlString) : undefined;
    }

    try {
      const response = await fetch(SET_WEBHOOK_METHOD_URL, requestOptions).then(res => res.json());
      if (!response.ok) throw new Error(response.description);
      if (!argv.silent) {
        console.dir(response);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
