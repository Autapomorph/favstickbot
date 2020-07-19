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

StickerSchema.statics.createNew = async function createNew(pack, emojis, inputFile, uploadedFile) {
  const sticker = await this.create({
    pack,
    fileId: uploadedFile.fileId,
    fileUniqueId: uploadedFile.fileUniqueId,
    emojis,
    original: {
      fileId: inputFile.fileId,
      fileUniqueId: inputFile.fileUniqueId,
      fileType: inputFile.type,
    },
  });

  logger.debug('New sticker has been created: %s', sticker.id);
  return sticker;
};

const Sticker = mongoose.model('Sticker', StickerSchema);

module.exports = Sticker;
