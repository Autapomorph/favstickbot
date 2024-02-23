import hi from 'human-interval';

import { Pack } from '../../models/Pack.js';
import { logger } from '../../utils/logger/index.js';

const jobName = 'packs-delete-outdated';

const defaultThreshold = hi('7 days');

export const packsDeleteOutdatedJob = agenda => {
  agenda.define(jobName, { concurrency: 1 }, async job => {
    const jobData = job.attrs.data;
    if (typeof jobData.threshold !== 'number' && typeof jobData.threshold !== 'string') {
      jobData.threshold = defaultThreshold;
    }

    const thresholdMs = hi(jobData.threshold) || defaultThreshold;
    const thresholdDate = new Date(new Date().setTime(new Date().getTime() - thresholdMs));

    logger.info(
      'Job "%s": deleting hidden packs last updated at %s or earlier',
      jobName,
      thresholdDate,
    );

    const result = await Pack.deleteMany({ isHidden: true, updatedAt: { $lt: thresholdDate } });
    logger.info('Job "%s": %d packs deleted', jobName, result.deletedCount);
  });
};
