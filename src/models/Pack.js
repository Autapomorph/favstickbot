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
      unique: true,
      required: true,
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
    hasTgInstance: {
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
  await Sticker.deleteMany({ pack: this.id });
});

PackSchema.pre('deleteMany', async function pre() {
  const userPacksIds = await this.model.find(this.getFilter()).distinct('_id');
  await Sticker.deleteMany({ pack: { $in: userPacksIds } });
});

const Pack = mongoose.model('Pack', PackSchema);

module.exports = Pack;
