import 'dotenv/config';

import { connect } from '../src/database.js';
import { bot } from '../src/bot.js';
import { WEBHOOK_OPTIONS } from '../src/config/webhook.js';

const { MONGODB_URI } = process.env;

const webhookCallback = bot.webhookCallback(WEBHOOK_OPTIONS.path);
connect(MONGODB_URI);

export default (req, res) => {
  return webhookCallback(req, res);
};
