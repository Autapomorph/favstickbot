import mongoose from 'mongoose';

import { logger } from '../utils/logger/index.js';

const SessionSchema = mongoose.Schema(
  {
    _id: mongoose.Types.Long,
    data: Object,
    updatedAt: {
      type: Date,
      default: Date.now(),
      expires: '12h',
    },
  },
  {
    timestamps: true,
  },
);

SessionSchema.statics.updateOrCreate = async function updateOrCreate(key, data) {
  const sessionResult = await this.findByIdAndUpdate(
    key,
    {
      data,
    },
    { upsert: true, omitUndefined: true, includeResultMetadata: true },
  );

  const { upserted: upsertedId, updatedExisting } = sessionResult.lastErrorObject;
  if (!updatedExisting) {
    logger.debug('New session created: %s', upsertedId);
  }

  return sessionResult.value;
};

export const Session = mongoose.model('Session', SessionSchema);
