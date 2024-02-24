import fetchToCurl from 'fetch-to-curl';
import clipboardy from 'clipboardy';
import open from 'open';

import { TELEGRAM_API } from './constants.js';

export const getFileCommand = {
  command: 'getFile <fileId>',
  description: 'Get file download link by ID',
  builder: y => {
    y.positional('fileId', {
      description: 'File ID to prepare for download',
      type: 'string',
    });
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
    const BOT_API_FILE_URL = `${TELEGRAM_API}/file/bot${argv.token}`;
    const GET_FILE_METHOD_URL = `${BOT_API_URL}/getFile`;

    try {
      const response = await fetch(`${GET_FILE_METHOD_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: argv.fileId,
        }),
      }).then(res => res.json());
      if (!response.ok) throw new Error(response.description);

      const downloadURL = `${BOT_API_FILE_URL}/${response.result.file_path}`;

      if (argv.curl) {
        const curlString = fetchToCurl(downloadURL);
        if (!argv.silent) console.log(curlString);
        return argv.copy ? clipboardy.write(curlString) : undefined;
      }

      if (argv.open) {
        return open(downloadURL);
      }

      if (!argv.silent) {
        console.log(`The file is available to download here:\n${downloadURL}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
