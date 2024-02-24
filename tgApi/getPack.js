import fetchToCurl from 'fetch-to-curl';
import clipboardy from 'clipboardy';
import open from 'open';

import { T_ME } from './constants.js';

const ADD_PACK_URL = `${T_ME}/addstickers`;

export const getPackCommand = {
  command: 'getPack <pack>',
  description: 'Get pack link by name',
  builder: y => {
    y.positional('pack', {
      description: 'Pack name',
      alias: 'packName',
      type: 'string',
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
    const packURL = `${ADD_PACK_URL}/${argv.pack}`;

    if (argv.curl) {
      const curlString = fetchToCurl(packURL);
      if (!argv.silent) console.log(curlString);
      return argv.copy ? clipboardy.write(curlString) : undefined;
    }

    if (argv.open) {
      return open(packURL);
    }

    if (!argv.silent) {
      console.log(`The sticker pack is available here:\n${packURL}`);
    }
  },
};
