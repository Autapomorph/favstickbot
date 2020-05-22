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
      index: true,
      unique: true,
      required: true,
    },
    fileUniqueId: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    emojis: String,
    original: {
      fileId: String,
      fileUniqueId: String,
      packName: String,
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
    fileId: uploadedFile.file_id,
    fileUniqueId: uploadedFile.file_unique_id,
    emojis,
    original: {
      fileId: inputFile.file_id,
      fileUniqueId: inputFile.file_unique_id,
      packName: inputFile.set_name,
      fileType: inputFile.type,
    },
  });

  logger.debug('New sticker has been created:\n%O', sticker);
  return sticker;
};

const Sticker = mongoose.model('Sticker', StickerSchema);

module.exports = Sticker;
