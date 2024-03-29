import mongoose from 'mongoose';

import { logger } from '../utils/logger/index.js';

const StickerSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      alias: 'fileId',
    },
    packId: {
      type: String,
      ref: 'Pack',
    },
    uid: {
      type: String,
      unique: true,
      required: true,
      alias: 'fileUniqueId',
    },
    original: {
      id: {
        type: String,
        required: true,
        alias: 'original.fileId',
      },
      type: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

StickerSchema.pre('save', function pre() {
  this.wasJustCreated = this.isNew;
});

StickerSchema.post('save', function post() {
  if (this.wasJustCreated) {
    logger.debug('New sticker created: %s', this.id);
  }
});

StickerSchema.query.byUID = function byUID(uid) {
  return this.where({ uid });
};

export const Sticker = mongoose.model('Sticker', StickerSchema);
