require('dotenv').config();

const fetch = require('node-fetch');
const minimist = require('minimist');
const open = require('open');

const { TELEGRAM_API } = require('./constants');

const argv = minimist(process.argv.slice(2), {
  alias: {
    botToken: ['t', 'token', 'bottoken'],
    fileId: ['f', 'fileid'],
  },
  default: {
    botToken: process.env.BOT_TOKEN,
  },
});

const BOT_API_URL = `${TELEGRAM_API}/bot${argv.botToken}`;
const BOT_API_FILE_URL = `${TELEGRAM_API}/file/bot${argv.botToken}`;

const GET_FILE_METHOD_URL = `${BOT_API_URL}/getFile`;

if (!argv.botToken) {
  console.log(`Please provide \`--token\` or \`-t\` argument`);
  console.log(`Usage: openFile --token bot_token`);
  process.exit();
}

if (!argv.fileId) {
  console.log(`Please provide \`--fileId\` or \`-f\` argument`);
  console.log(`Usage: openFile --fileId file_id`);
  process.exit();
}

fetch(`${GET_FILE_METHOD_URL}?file_id=${argv.fileId}`)
  .then(response => response.json())
  .then(response => {
    if (!response.ok) throw new Error(response.description);
    const downloadURL = `${BOT_API_FILE_URL}/${response.result.file_path}`;
    console.log(`The file is available to download on ${downloadURL}`);
    return open(downloadURL);
  })
  .catch(error => console.error(error.message));
