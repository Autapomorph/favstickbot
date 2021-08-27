const mongoose = require('mongoose');

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
  return this.findByIdAndUpdate(
    key,
    {
      data,
    },
    { upsert: true, rawResult: true },
  );
};

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
