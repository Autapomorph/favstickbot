const fetch = require('node-fetch');
const open = require('open');

const { TELEGRAM_API } = require('./constants');

module.exports = {
  command: 'openFile <fileId>',
  description: 'Open file by ID',
  builder: y => {
    y.positional('fileId', {
      description: 'File ID to open',
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
    y.option('open', {
      description: 'Open in browser',
      alias: 'o',
      type: 'boolean',
      default: true,
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
    const BOT_API_FILE_URL = `${TELEGRAM_API}/file/bot${argv.token}`;
    const GET_FILE_METHOD_URL = `${BOT_API_URL}/getFile`;

    try {
      const response = await fetch(`${GET_FILE_METHOD_URL}?file_id=${argv.fileId}`).then(res =>
        res.json(),
      );
      if (!response.ok) throw new Error(response.description);

      const downloadURL = `${BOT_API_FILE_URL}/${response.result.file_path}`;

      if (argv.print) {
        console.log(`The file is available to download here: ${downloadURL}`);
      }

      if (argv.open) {
        return open(downloadURL);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
