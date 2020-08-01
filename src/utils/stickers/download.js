const downloadFile = require('../common/downloadFile');

const downloadSticker = async (ctx, fileId) => {
  const fileUrl = await ctx.telegram.getFileLink(fileId);
  return downloadFile(fileUrl);
};

module.exports = downloadSticker;
