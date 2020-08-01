const mongoose = require('mongoose');

const Pack = require('./Pack');
const { defaultLocale } = require('../config/i18n');
const logger = require('../utils/logger');

const UserSchema = mongoose.Schema(
  {
    telegramId: {
      type: Number,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    username: String,
    selectedPack: {
      type: mongoose.Schema.Types.ObjectId,
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
  await Pack.deleteMany({ owner: this.id });
});

UserSchema.statics.updateOrCreate = async function updateOrCreate(tgUser) {
  const userResult = await this.findOneAndUpdate(
    { telegramId: tgUser.id },
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
