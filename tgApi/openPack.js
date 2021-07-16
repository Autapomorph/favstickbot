const open = require('open');

const { T_ME } = require('./constants');

const ADD_PACK_URL = `${T_ME}/addstickers`;

module.exports = {
  command: 'openPack <pack>',
  description: 'Open pack by name',
  builder: y => {
    y.positional('pack', {
      description: 'Pack name',
      alias: 'packName',
      type: 'string',
    });
    y.option('open', {
      description: 'Open in browser',
      alias: 'o',
      type: 'boolean',
      default: true,
    });
    y.option('print', {
      description: 'Print results',
      type: 'boolean',
      default: true,
    });
    y.version();
    y.alias('version', 'v');
    y.help();
    y.alias('help', 'h');
  },
  handler: async argv => {
    const packURL = `${ADD_PACK_URL}/${argv.pack}`;

    if (argv.print) {
      console.log(`The sticker pack is available here: ${packURL}`);
    }

    if (argv.open) {
      return open(packURL);
    }
  },
};
