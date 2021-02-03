require('dotenv').config();

const express = require('express');
const Agendash = require('agendash');
const open = require('open');

const database = require('./database');
const { agenda, startAgenda } = require('./agenda');
const logger = require('./utils/logger');

database.connect(process.env.MONGODB_URI).then(startAgenda);

const app = express();
app.use('/', Agendash(agenda));

const server = app.listen(process.env.AGENDASH_PORT);
server.on('listening', () => {
  const details = server.address();
  const address = details.address === '::' ? 'localhost' : details.address;
  const localAddress = `http://${address}:${details.port}`;

  agenda.on('ready', () => {
    logger.info(`Agendash is running on ${localAddress}`);
    open(localAddress);
  });
});

async function shutdown(signal) {
  logger.info(`Shutting down due to ${signal}`);
  await agenda.stop();
  await database.disconnect();
  process.exit(0);
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
