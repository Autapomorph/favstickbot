const mongoose = require('mongoose');

const logger = require('../utils/logger');

const StickerSchema = mongoose.Schema(
  {
    pack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pack',
    },
    fileId: {
      type: String,
      unique: true,
      required: true,
    },
    fileUniqueId: {
      type: String,
      unique: true,
      required: true,
    },
    emojis: String,
    original: {
      fileId: String,
      fileUniqueId: String,
      fileType: String,
    },
  },
  {
    timestamps: true,
  },
);

StickerSchema.pre('save', function pre() {
  this.wasJustCreated = this.isNew;
});

StickerSchema.post('save', function post() {
  if (this.wasJustCreated) {
    logger.debug('New sticker has been created: %s', this.id);
  }
});

const Sticker = mongoose.model('Sticker', StickerSchema);

module.exports = Sticker;
