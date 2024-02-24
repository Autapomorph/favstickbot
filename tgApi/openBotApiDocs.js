import fetchToCurl from 'fetch-to-curl';
import clipboardy from 'clipboardy';
import open from 'open';

import { CORE } from './constants.js';

export const openBotApiDocsCommand = {
  command: 'openDocs',
  description: 'Open Telegram Bot API docs page',
  aliases: ['docs'],
  builder: y => {
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
    y.version();
    y.help();
    y.alias('version', 'v');
    y.alias('help', 'h');
  },
  handler: async argv => {
    const docsURL = `${CORE}/bots/api`;

    if (argv.curl) {
      const curlString = fetchToCurl(docsURL);
      console.log(curlString);
      return argv.copy ? clipboardy.write(curlString) : undefined;
    }

    return open(docsURL);
  },
};
