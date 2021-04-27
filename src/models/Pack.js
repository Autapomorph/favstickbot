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
      type: mongoose.Types.Long,
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

PackSchema.virtual('stickers', {
  ref: 'Sticker',
  localField: '_id',
  foreignField: 'packId',
});

PackSchema.pre('save', async function pre() {
  if (this.isNew) {
    // If user tries to create pack with name that already exists in database
    // (e.g. it was deleted using @Stickers bot), we should delete this pack
    // eslint-disable-next-line no-use-before-define
    await Pack.findByIdAndDelete(this.id);
  }

  this.wasJustCreated = this.isNew;
});

PackSchema.post('save', function post() {
  if (this.wasJustCreated) {
    logger.debug('New pack created: %s', this.id);
  }
});

PackSchema.pre('deleteOne', { document: true }, async function pre() {
  await Sticker.deleteMany({ packId: this.id });
});

PackSchema.pre(['deleteOne', 'findOneAndDelete'], async function pre() {
  await Sticker.deleteMany({ packId: this.getFilter()._id });
});

PackSchema.pre('deleteMany', async function pre() {
  const userPacksIds = await this.model.find(this.getFilter()).distinct('_id');
  await Sticker.deleteMany({ packId: { $in: userPacksIds } });
});

PackSchema.query.byUser = function byUserId(userId) {
  return this.where({ userId });
};

PackSchema.query.byIsArchived = function byIsArchived(isArchived = false) {
  return this.where({ isArchived });
};

PackSchema.query.byIsAnimated = function byIsAnimated(isAnimated = false) {
  return this.where({ isAnimated: Boolean(isAnimated) });
};

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
