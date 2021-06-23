require('dotenv').config();

const fetch = require('node-fetch');
const minimist = require('minimist');
const open = require('open');

const { TELEGRAM_API } = require('./constants');

const argv = minimist(process.argv.slice(2), {
  alias: {
    botToken: ['t', 'token', 'bottoken'],
    open: ['o'],
  },
  default: {
    botToken: process.env.BOT_TOKEN,
  },
});

const BOT_API_URL = `${TELEGRAM_API}/bot${argv.botToken}`;

const GET_ME_METHOD_URL = `${BOT_API_URL}/getMe`;

if (!argv.botToken) {
  console.log(`Please provide \`--token\` or \`-t\` argument`);
  console.log(`Usage: getMe --token bot_token`);
  process.exit();
}

fetch(GET_ME_METHOD_URL)
  .then(response => response.json())
  .then(response => {
    if (!response.ok) throw new Error(response.description);
    console.log(JSON.stringify(response.result, null, 2));
    if (argv.open) {
      open(GET_ME_METHOD_URL);
    }
  })
  .catch(error => console.error(error.message));
