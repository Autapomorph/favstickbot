require('dotenv').config();

const minimist = require('minimist');
const open = require('open');

const { T_ME } = require('./constants');

const argv = minimist(process.argv.slice(2), {
  alias: {
    pack: 'p',
  },
});

const ADD_PACK_URL = `${T_ME}/addstickers`;

if (!argv.pack) {
  console.log(`Please provide \`--pack\` or \`-p\` argument`);
  console.log(`Usage: openPack --pack pack_name`);
  process.exit();
}

const packURL = `${ADD_PACK_URL}/${argv.pack}`;
console.log(`The sticker pack is available on ${packURL}`);
open(packURL);
