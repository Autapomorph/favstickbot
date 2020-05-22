const mongoose = require('mongoose');

const Sticker = require('./Sticker');
const logger = require('../utils/logger');

const PackSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      index: true,
      required: true,
    },
    isAnimated: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    hasTgInstance: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

PackSchema.statics.createNew = async function createNew(packData) {
  const { owner, name, title, isAnimated = false, hasTgInstance = false } = packData;

  // if user tries to create pack with name that already exists
  // (e.g. user has deleted pack using @Stickers bot),
  // we should delete existing pack and stickers added to it
  const oldPack = await this.findOne({ name });
  if (oldPack) {
    await Sticker.deleteMany({ pack: oldPack.id });
    await oldPack.remove();
  }

  const newPack = await this.create({
    owner,
    name,
    title,
    isAnimated,
    hasTgInstance,
  });

  logger.debug('New sticker pack has been created:\n%O', newPack);
  return newPack;
};

PackSchema.statics.findOrCreate = async function findOrCreate(packData) {
  const pack = await this.findOne({ name: packData.name });

  if (pack) {
    return pack;
  }

  return this.createNew(packData);
};

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
