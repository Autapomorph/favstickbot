import { downloadFile } from '../common/downloadFile.js';

export const downloadSticker = async (ctx, fileId) => {
  const fileUrl = await ctx.telegram.getFileLink(fileId);
  return downloadFile(fileUrl);
};
