const mongoose = require('mongoose');

const Pack = require('./Pack');
const { defaultLocale } = require('../config/i18n');
const logger = require('../utils/logger');

const UserSchema = mongoose.Schema(
  {
    telegramId: {
      type: Number,
      index: true,
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
      default: defaultLocale,
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

UserSchema.statics.createNew = async function createNew(tgUser) {
  const user = await this.create({
    telegramId: tgUser.id,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
    username: tgUser.username,
    locale: tgUser.language_code,
    selectedPack: null,
  });

  logger.debug('New user has been created: %s', user.id);
  return user;
};

UserSchema.statics.updateOrCreate = async function updateOrCreate(tgUser) {
  const updatedUser = await this.findOneAndUpdate(
    { telegramId: tgUser.id },
    {
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      updatedAt: new Date(),
    },
    { new: true },
  );

  if (updatedUser) {
    return updatedUser;
  }

  return this.createNew(tgUser);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
