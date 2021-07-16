#!/usr/bin/env node

require('dotenv').config();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .scriptName('tg-api')
  .usage('$0 <cmd> [args]')
  .command(require('./openBotApiDocs'))
  .command(require('./getMe'))
  .command(require('./openPack'))
  .command(require('./openFile'))
  .command(require('./webhook'))
  .demandCommand(1, 'You need at least one command before moving on')
  .version()
  .alias('version', 'v')
  .help()
  .alias('help', 'h')
  .recommendCommands()
  .strictCommands()
  .parse();
