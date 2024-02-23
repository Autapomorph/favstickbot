#!/usr/bin/env node

import 'dotenv/config';
import express from 'express';
import Agendash from 'agendash';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import open from 'open';

import * as database from './database.js';
import { agenda, collectionName } from './agenda/index.js';
import { logger } from './utils/logger/index.js';

yargs(hideBin(process.argv))
  .scriptName('agendash')
  .usage('$0 [args]')
  .command({
    command: '$0',
    description: 'Launch Agendash',
    aliases: ['start'],
    builder: y => {
      y.option('mongoURI', {
        description: 'MongoDB connection string',
        alias: 'uri',
        type: 'string',
        default: process.env.MONGODB_URI,
        defaultDescription: 'process.env.MONGODB_URI',
        demandOption: 'Please provide MongoDB URI',
      });
      y.option('port', {
        description: 'The port Agendash should bind to',
        alias: 'p',
        type: 'number',
        default: process.env.AGENDASH_PORT,
        defaultDescription: 'process.env.AGENDASH_PORT',
      });
      y.option('open', {
        description: 'Open in browser',
        alias: 'o',
        type: 'boolean',
        default: false,
      });
    },
    handler: start,
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .parse();

let server;
let app;

async function start(argv) {
  const connection = await database.connect(argv.mongoURI);

  agenda.mongo(connection.db, collectionName).start();

  app = express();
  app.use('/', Agendash(agenda));

  server = app.listen(argv.port);
  server.on('listening', () => {
    const details = server.address();
    const address = details.address === '::' ? 'localhost' : details.address;
    const localAddress = `http://${address}:${details.port}`;

    agenda.on('ready', () => {
      logger.info(`Agendash is running on ${localAddress}`);
      if (argv.open) {
        open(localAddress);
      }
    });
  });
}

async function shutdown(signal) {
  logger.info(`Shutting down${signal ? ` (${signal})` : ''}`);
  await agenda.stop();
  await database.disconnect();
  await server?.close();
  process.exit(0);
}

process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGTERM', shutdown);
