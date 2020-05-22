const { BOT_TOKEN, BOT_DOMAIN, WEBHOOK_PORT } = process.env;

const WEBHOOK_OPTIONS = {
  domain: BOT_DOMAIN,
  hookPath: `/${BOT_TOKEN}`,
  port: WEBHOOK_PORT || 2500,
};

module.exports = WEBHOOK_OPTIONS;
