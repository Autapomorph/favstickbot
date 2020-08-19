const mongoose = require('mongoose');

const Sticker = require('./Sticker');
const logger = require('../utils/logger');

const PackSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      alias: 'name',
    },
    userId: {
      type: Number,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    isAnimated: {
      type: Boolean,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

PackSchema.pre('save', async function pre() {
  if (this.isNew) {
    // if user tries to create pack with name that already exists in database
    // (e.g. it was deleted using @Stickers bot),
    // we should delete this pack
    // eslint-disable-next-line no-use-before-define
    const oldPack = await Pack.findById(this.id);
    if (oldPack) {
      await oldPack.deleteOne();
    }
  }

  this.wasJustCreated = this.isNew;
});

PackSchema.post('save', function post() {
  if (this.wasJustCreated) {
    logger.debug('New pack has been created: %s', this.id);
  }
});

PackSchema.pre('deleteOne', { document: true }, async function pre() {
  await Sticker.deleteMany({ packId: this.id });
});

PackSchema.pre('deleteMany', async function pre() {
  const userPacksIds = await this.model.find(this.getFilter()).distinct('_id');
  await Sticker.deleteMany({ packId: { $in: userPacksIds } });
});

PackSchema.statics.findOneVisible = async function findOneVisible(userId) {
  return this.findOne({
    userId,
    isHidden: false,
  });
};

PackSchema.statics.findVisible = async function findVisible(userId) {
  return this.find({
    userId,
    isHidden: false,
  });
};

PackSchema.statics.findOneHidden = async function findOneHidden(userId, name) {
  return this.findOne({
    _id: name,
    userId,
    isHidden: true,
  });
};

PackSchema.statics.findOneByType = async function findOneByType(userId, isAnimated) {
  return this.findOne({
    userId,
    isAnimated,
    isHidden: false,
  });
};

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
