/* eslint-disable global-require */
module.exports = {
  command: 'webhook',
  aliases: ['wh'],
  description: 'Webhook commands',
  builder: y => {
    y.command(require('./set'));
    y.command(require('./get'));
    y.command(require('./delete'));
    y.version();
    y.help();
    y.alias('version', 'v');
    y.alias('help', 'h');
    y.demandCommand(1, 'You need at least one command before moving on');
  },
};
