const Pack = require('../../models/Pack');
const { telegram } = require('../../bot');
const validateError = require('../../utils/errors/validateErrorType');
const ERROR_TYPES = require('../../utils/errors/types');
const logger = require('../../utils/logger');

const jobName = 'packs-delete-non-existent';

module.exports = agenda => {
  agenda.define(jobName, { concurrency: 1 }, async () => {
    const packs = await Pack.find();

    const requests = packs.map(
      pack =>
        new Promise(resolve => {
          telegram
            .getStickerSet(pack.id)
            // Resolve null from Telegram response as it shouldn't be removed
            .then(() => resolve(null))
            // If there is no pack on Telegram servers
            // It means that this pack was deleted
            // And it should be removed from db
            .catch(error => {
              if (!validateError(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error)) throw error;
              resolve(pack.id);
            });
        }),
    );

    const packsToDeleteIds = (await Promise.all(requests)).filter(Boolean);

    logger.info('Job "%s": deleting %d empty packs', jobName, packsToDeleteIds.length);

    const result = await Pack.deleteMany({ _id: { $in: packsToDeleteIds } });
    logger.info('Job "%s": %d packs deleted', jobName, result.deletedCount);
  });
};
