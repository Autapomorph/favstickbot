const open = require('open');

const { CORE } = require('./constants');

module.exports = {
  command: 'openDocs',
  description: 'Open Telegram Bot API docs page',
  aliases: ['docs'],
  builder: y => {
    y.version();
    y.alias('version', 'v');
    y.help();
    y.alias('help', 'h');
  },
  handler: async () => {
    return open(`${CORE}/bots/api`);
  },
};
