#!/usr/bin/env node

require('dotenv').config();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .scriptName('tg-api')
  .usage('$0 <cmd> [args]')
  .command(require('./openBotApiDocs'))
  .command(require('./getMe'))
  .command(require('./getPack'))
  .command(require('./getFile'))
  .command(require('./webhook'))
  .version()
  .help()
  .alias('version', 'v')
  .alias('help', 'h')
  .recommendCommands()
  .strictCommands()
  .demandCommand(1, 'You need at least one command before moving on')
  .parse();
