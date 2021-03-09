module.exports = async (ctx, packToCreate) => {
  const createdPack = await ctx.getStickerSet(packToCreate.name);
  const stickerToDelete = createdPack.stickers.slice(-1)[0];
  if (stickerToDelete) {
    return ctx.deleteStickerFromSet(stickerToDelete.file_id);
  }
};
