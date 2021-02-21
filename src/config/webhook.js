const { BOT_TOKEN, WEBHOOK_DOMAIN, WEBHOOK_PATH, WEBHOOK_HOST, WEBHOOK_PORT } = process.env;

const WEBHOOK_OPTIONS = {
  domain: WEBHOOK_DOMAIN,
  hookPath: WEBHOOK_PATH ?? `/bot/${BOT_TOKEN}`,
  host: WEBHOOK_HOST,
  port: Number.parseInt(WEBHOOK_PORT, 10) || 2500,
};

module.exports = WEBHOOK_OPTIONS;
