const hi = require('human-interval');

const Pack = require('../../models/Pack');
const { telegram } = require('../../bot');
const validateError = require('../../utils/errors/validateErrorType');
const ERROR_TYPES = require('../../utils/errors/types');
const logger = require('../../utils/logger');

const jobName = 'packs-delete-empty';

const defaultThreshold = hi('7 days');

module.exports = agenda => {
  agenda.define(jobName, { concurrency: 1 }, async job => {
    const jobData = job.attrs.data;
    if (typeof jobData.threshold !== 'number' && typeof jobData.threshold !== 'string') {
      jobData.threshold = defaultThreshold;
    }

    const thresholdMs = hi(jobData.threshold) || defaultThreshold;
    const thresholdDate = new Date(new Date().setTime(new Date().getTime() - thresholdMs));

    const packsIds = await Pack.find({ updatedAt: { $lt: thresholdDate } }).distinct('_id');

    const requests = packsIds.map(id => {
      return new Promise(resolve => {
        telegram
          .getStickerSet(id)
          // Resolve pack data from Telegram response
          .then(tgPack =>
            resolve({
              id: tgPack.name,
              stickersCount: tgPack.stickers.length,
            }),
          )
          .catch(error => {
            // If there is no pack on Telegram servers
            // It means that this pack was deleted
            // And it should be removed from db
            if (!validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) throw error;
            resolve({ id });
          });
      });
    });

    const packsToDeleteIds = (await Promise.all(requests))
      .filter(pack => !pack.stickersCount || pack.stickersCount <= 0)
      .map(pack => pack.id);

    logger.info('Job "%s": deleting %d empty packs', jobName, packsToDeleteIds.length);

    const result = await Pack.deleteMany({ _id: { $in: packsToDeleteIds } });
    logger.info('Job "%s": %d packs deleted', jobName, result.deletedCount);
  });
};
