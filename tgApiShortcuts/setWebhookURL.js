require('dotenv').config();

const fetch = require('node-fetch');
const minimist = require('minimist');

const { TELEGRAM_API } = require('./constants');
const WEBHOOK_OPTIONS = require('../src/config/webhook');

const argv = minimist(process.argv.slice(2), {
  alias: {
    botToken: ['t', 'token', 'bottoken'],
    webhookURL: ['u', 'url'],
  },
  default: {
    botToken: process.env.BOT_TOKEN,
    webhookURL: `${WEBHOOK_OPTIONS.domain}${WEBHOOK_OPTIONS.hookPath}`,
  },
});

const BOT_API_URL = `${TELEGRAM_API}/bot${argv.botToken}`;

const SET_WEBHOOK_METHOD_URL = `${BOT_API_URL}/setWebhook`;
const GET_WEBHOOK_INFO_METHOD_URL = `${BOT_API_URL}/getWebhookInfo`;

if (!argv.botToken) {
  console.log(`Please provide \`--token\` or \`-t\` argument`);
  console.log(`Usage: getMe --token bot_token`);
  process.exit();
}

if (!argv.webhookURL) {
  console.log(`Please provide \`--url\` or \`-u\` argument`);
  console.log(`setWebhookURL: getMe --url webhook_url`);
  process.exit();
}

fetch(`${SET_WEBHOOK_METHOD_URL}?url=${argv.webhookURL}`)
  .then(response => response.json())
  .then(response => {
    if (!response.ok) throw new Error(response.description);
    console.dir(response.result);
  })
  .then(() => fetch(GET_WEBHOOK_INFO_METHOD_URL))
  .then(response => response.json())
  .then(response => {
    if (!response.ok) throw new Error(response.description);
    console.dir(response.result);
  })
  .catch(error => console.error(error.message));
