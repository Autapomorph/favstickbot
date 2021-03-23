const mongoose = require('mongoose');

const logger = require('../utils/logger');

const SessionSchema = mongoose.Schema(
  {
    _id: Number,
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
    { upsert: true, omitUndefined: true, rawResult: true },
  );

  const { upserted: upsertedId } = sessionResult.lastErrorObject;
  if (upsertedId) {
    logger.debug('New session created: %s', upsertedId);
  }

  return sessionResult.value;
};

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
