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
    isArchived: {
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

PackSchema.statics.findAll = async function findVisible(userId) {
  return this.find({
    userId,
  });
};

PackSchema.statics.findVisible = async function findVisible(userId) {
  return this.find({
    userId,
    isArchived: false,
  });
};

PackSchema.statics.findArchived = async function findArchived(userId) {
  return this.find({
    userId,
    isArchived: true,
  });
};

PackSchema.statics.findOneVisible = async function findOneVisible(userId) {
  return this.findOne({
    userId,
    isArchived: false,
  });
};

PackSchema.statics.findOneArchived = async function findOneArchived(userId, name) {
  return this.findOne({
    _id: name,
    userId,
    isArchived: true,
  });
};

PackSchema.statics.findOneVisibleByType = async function findOneVisibleByType(userId, isAnimated) {
  return this.findOne({
    userId,
    isAnimated,
    isArchived: false,
  });
};

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
