#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { openBotApiDocsCommand } from './openBotApiDocs.js';
import { getMeCommand } from './getMe.js';
import { getPackCommand } from './getPack.js';
import { getFileCommand } from './getFile.js';
import { webhookCommand } from './webhook/index.js';

yargs(hideBin(process.argv))
  .scriptName('tg-api')
  .usage('$0 <cmd> [args]')
  .command(openBotApiDocsCommand)
  .command(getMeCommand)
  .command(getPackCommand)
  .command(getFileCommand)
  .command(webhookCommand)
  .version()
  .help()
  .alias('version', 'v')
  .alias('help', 'h')
  .recommendCommands()
  .strictCommands()
  .demandCommand(1, 'You need at least one command before moving on')
  .parse();
