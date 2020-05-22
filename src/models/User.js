const mongoose = require('mongoose');

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
    locale: String,
  },
  {
    timestamps: true,
  },
);

UserSchema.pre(['find', 'findOne'], function pre() {
  this.populate('selectedPack');
});

UserSchema.statics.createNew = async function createNew(tgUser) {
  const user = await this.create({
    telegramId: tgUser.id,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
    username: tgUser.username,
  });

  logger.debug('New user has been created:\n%O', user);
  return user;
};

UserSchema.statics.findOrCreate = async function findOrCreate(tgUser) {
  const user = await this.findOne({ telegramId: tgUser.id }).populate('selectedPack');

  if (user) {
    return user;
  }

  return this.createNew(tgUser);
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
  ).populate('selectedPack');

  if (updatedUser) {
    return updatedUser;
  }

  return this.createNew(tgUser);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
