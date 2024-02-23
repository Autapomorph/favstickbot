import { Agenda } from 'agenda';

import { jobs } from './jobs/index.js';
import { logger } from '../utils/logger/index.js';

export const collectionName = '_agendaJobs';

export const agenda = new Agenda();

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
