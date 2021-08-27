const mongoose = require('mongoose');

const Pack = require('./Pack');
const Session = require('./Session');
const { rolesList } = require('../config/roles');
const { defaultLocale } = require('../config/i18n');
const logger = require('../utils/logger');

const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Types.Long,
    firstName: String,
    lastName: String,
    username: String,
    selectedPack: {
      type: String,
      ref: 'Pack',
    },
    role: {
      type: String,
      required: true,
      enum: rolesList,
      default: 'user',
    },
    settings: {
      locale: {
        type: String,
        default: defaultLocale.code,
      },
      showArchivedPacks: {
        type: Boolean,
        default: false,
      },
    },
    ban: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  },
);

UserSchema.virtual('packs', {
  ref: 'Pack',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function pre() {
  this.populate('selectedPack');
});

UserSchema.pre('deleteOne', { document: true }, async function pre() {
  await Pack.deleteMany({ userId: this.id });
  await Session.deleteOne({ _id: this.id });
  logger.debug('User data deleted: %s', this.id);
});

UserSchema.statics.updateOrCreate = async function updateOrCreate(tgUser) {
  const user = await this.findByIdAndUpdate(
    tgUser.id,
    {
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      $setOnInsert: { 'settings.locale': tgUser.language_code || defaultLocale.code },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
