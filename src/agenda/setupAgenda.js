require('dotenv').config();

const Agenda = require('agenda');

const jobs = require('./jobs');
const db = require('../database');
const logger = require('../utils/logger');

const { MONGODB_URI } = process.env;

const agenda = new Agenda();

jobs.forEach(job => job(agenda));

const gracefulShutdown = async () => {
  await agenda.stop();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const setupAgenda = async () => {
  const connection = await db.connect(MONGODB_URI);
  await new Promise(resolve => agenda.mongo(connection.db, '_agendaJobs', resolve));
  await agenda.start();
  return agenda;
};

agenda.on('start', job => {
  const { name, data } = job.attrs;
  logger.info('Job "%s": invoked with data: %o', name, data);
});

agenda.on('success', job => {
  const { name } = job.attrs;
  logger.info('Job "%s": completed successfully', name);
});

agenda.on('fail', (error, job) => {
  const { name } = job.attrs;
  logger.error(error, {
    description: `Job "${name}": failed:`,
    tags: {
      agendaJob: true,
    },
  });
});

module.exports = setupAgenda;
