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

PackSchema.pre('deleteOne', { document: true }, async function pre() {
  await Sticker.deleteMany({ pack: this.id });
});

PackSchema.pre('deleteMany', async function pre() {
  const userPacksIds = await this.model.find(this.getFilter()).distinct('_id');
  await Sticker.deleteMany({ pack: { $in: userPacksIds } });
});

PackSchema.statics.createNew = async function createNew(packData) {
  const { owner, name, title, isAnimated = false, hasTgInstance = false } = packData;

  // if user tries to create pack with name that already exists in database
  // (e.g. user has deleted pack using @Stickers bot),
  // we should delete existing pack and stickers added to it
  const oldPack = await this.findOne({ name });
  if (oldPack) {
    await oldPack.deleteOne();
  }

  const newPack = await this.create({
    owner,
    name,
    title,
    isAnimated,
    hasTgInstance,
  });

  logger.debug('New sticker pack has been created: %s', newPack.id);
  return newPack;
};

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
