import { Pack } from '../../models/Pack.js';
import { telegram } from '../../telegram.js';
import { validateTelegramErrorType } from '../../utils/errors/validateErrorType.js';
import * as ERROR_TYPES from '../../utils/errors/types/index.js';
import { logger } from '../../utils/logger/index.js';

const jobName = 'packs-delete-non-existent';

export const packsDeleteNonExistentJob = agenda => {
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
              if (!validateTelegramErrorType(ERROR_TYPES.TELEGRAM.STICKERSET_INVALID, error))
                throw error;
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
