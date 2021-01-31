require('dotenv').config();

const express = require('express');
const Agendash = require('agendash');
const open = require('open');

const { setupAgenda } = require('./agenda');
const logger = require('./utils/logger');

const app = express();

const start = () => {
  const server = app.listen(process.env.AGENDASH_PORT, async () => {
    const details = server.address();
    const address = details.address === '::' ? 'localhost' : details.address;
    const localAddress = `http://${address}:${details.port}`;
    logger.info(`Agendash is running on ${localAddress}`);
    await open(localAddress);
  });
};

const setupAgendash = async agenda => {
  app.use('/', Agendash(agenda));
};

setupAgenda().then(setupAgendash).then(start);

module.exports = app;
