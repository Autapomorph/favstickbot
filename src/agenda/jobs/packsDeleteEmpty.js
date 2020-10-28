const hi = require('human-interval');

const Pack = require('../../models/Pack');
const telegram = require('../../telegram');
const validateError = require('../../utils/errors/validateErrorType');
const ERROR_TYPES = require('../../utils/errors/errorTypes');
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

    const packs = await Pack.find({ updatedAt: { $lt: thresholdDate } });

    const requests = packs.map(pack => {
      return new Promise(resolve => {
        telegram
          .getStickerSet(pack.id)
          // Resolve pack data from Telegram response
          .then(tgPack => resolve(tgPack))
          .catch(error => {
            // If there is no pack on Telegram servers
            // It means that this pack was deleted
            // And it should be removed from db
            if (!validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) throw error;
            resolve({ name: pack.id });
          });
      });
    });

    const packsToDeleteIds = (await Promise.all(requests))
      .filter(pack => !pack.stickers || !pack.stickers.length)
      .map(pack => pack.name);

    logger.info('Job "%s": deleting %d empty packs', jobName, packsToDeleteIds.length);

    const result = await Pack.deleteMany({ _id: { $in: packsToDeleteIds } });
    logger.info('Job "%s": %d packs deleted', jobName, result.deletedCount);
  });
};
