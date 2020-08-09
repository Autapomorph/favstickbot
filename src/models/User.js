const mongoose = require('mongoose');

const Pack = require('./Pack');
const { defaultLocale } = require('../config/i18n');
const logger = require('../utils/logger');

const UserSchema = mongoose.Schema(
  {
    _id: Number,
    firstName: String,
    lastName: String,
    username: String,
    selectedPack: {
      type: String,
      ref: 'Pack',
    },
    locale: {
      type: String,
      default: defaultLocale.code,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function pre() {
  this.populate('selectedPack');
});

UserSchema.pre('deleteOne', { document: true }, async function pre() {
  await Pack.deleteMany({ userId: this.id });
  logger.debug('User data has been deleted: %s', this.id);
});

UserSchema.statics.updateOrCreate = async function updateOrCreate(tgUser) {
  const userResult = await this.findByIdAndUpdate(
    tgUser.id,
    {
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      $setOnInsert: { locale: tgUser.language_code },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true, rawResult: true },
  );

  const { upserted: upsertedId } = userResult.lastErrorObject;
  if (upsertedId) {
    logger.debug('New user has been created: %s', upsertedId);
  }

  return userResult.value;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
