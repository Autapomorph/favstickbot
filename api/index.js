require('dotenv').config();

const bot = require('../src/bot');
const database = require('../src/database');
const WEBHOOK_OPTIONS = require('../src/config/webhook');

const { MONGODB_URI } = process.env;

const webhookCallback = bot.webhookCallback(WEBHOOK_OPTIONS.hookPath);
database.connect(MONGODB_URI);

module.exports = (req, res) => {
  return webhookCallback(req, res);
};
