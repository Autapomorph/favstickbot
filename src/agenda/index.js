const { Agenda } = require('agenda');

const jobs = require('./jobs');
const logger = require('../utils/logger');

const agenda = new Agenda();

jobs.forEach(job => job(agenda));

agenda.on('ready', () => {
  logger.info('Agenda started');
});

agenda.on('error', () => {
  logger.error('Agenda failed', { tags: { agenda: true } });
});

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
    tags: { agenda: true },
  });
});

const collectionName = '_agendaJobs';

module.exports = { agenda, collectionName };
