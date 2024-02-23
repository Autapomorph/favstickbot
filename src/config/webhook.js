import { createWebhookPath } from '../utils/bot/createWebhookPath.js';

const { BOT_TOKEN, WEBHOOK_DOMAIN, WEBHOOK_HOST, WEBHOOK_PORT } = process.env;

export const WEBHOOK_OPTIONS = {
  domain: WEBHOOK_DOMAIN,
  hookPath: `/bots/${createWebhookPath(BOT_TOKEN)}`,
  host: WEBHOOK_HOST,
  port: Number.parseInt(WEBHOOK_PORT, 10) || 2500,
};
