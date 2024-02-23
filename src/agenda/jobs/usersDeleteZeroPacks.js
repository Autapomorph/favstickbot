import hi from 'human-interval';

import { User } from '../../models/User.js';
import { logger } from '../../utils/logger/index.js';

const jobName = 'users-delete-zero-packs';

const defaultThreshold = hi('30 days');

export const usersDeleteZeroPacksJob = agenda => {
  agenda.define(jobName, { concurrency: 1 }, async job => {
    const jobData = job.attrs.data;
    if (typeof jobData.threshold !== 'number' && typeof jobData.threshold !== 'string') {
      jobData.threshold = defaultThreshold;
    }

    const thresholdMs = hi(jobData.threshold) || defaultThreshold;
    const thresholdDate = new Date(new Date().setTime(new Date().getTime() - thresholdMs));

    const users = await User.aggregate([
      {
        $lookup: {
          from: 'packs',
          localField: '_id',
          foreignField: 'userId',
          as: 'packs',
        },
      },
      { $set: { packsCount: { $size: '$packs' } } },
      {
        $match: {
          packsCount: { $lte: 0 },
          updatedAt: {
            $lt: thresholdDate,
          },
        },
      },
      { $project: { _id: 1 } },
    ]);

    const userToDeleteIds = users.map(user => user._id);

    logger.info('Job "%s": deleting %d users with no packs', jobName, userToDeleteIds.length);

    const result = await User.deleteMany({ _id: { $in: userToDeleteIds } });
    logger.info('Job "%s": %d users deleted', jobName, result.deletedCount);
  });
};
