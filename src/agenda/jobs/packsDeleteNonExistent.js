const Pack = require('../../models/Pack');
const telegram = require('../../telegram');
const validateError = require('../../utils/errors/validateErrorType');
const ERROR_TYPES = require('../../utils/errors/types');
const logger = require('../../utils/logger');

const jobName = 'packs-delete-non-existent';

module.exports = agenda => {
  agenda.define(jobName, { concurrency: 1 }, async () => {
    const packsIds = await Pack.find().distinct('_id');

    const requests = packsIds.map(
      id =>
        new Promise(resolve => {
          telegram
            .getStickerSet(id)
            // Resolve null from Telegram response as it shouldn't be removed
            .then(() => resolve(null))
            // If there is no pack on Telegram servers
            // It means that this pack was deleted
            // And it should be removed from db
            .catch(error => {
              if (!validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) throw error;
              resolve(id);
            });
        }),
    );

    const packsToDeleteIds = (await Promise.all(requests)).filter(Boolean);

    logger.info('Job "%s": deleting %d non existent packs', jobName, packsToDeleteIds.length);

    const result = await Pack.deleteMany({ _id: { $in: packsToDeleteIds } });
    logger.info('Job "%s": %d packs deleted', jobName, result.deletedCount);
  });
};
