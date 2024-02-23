import { createSticker } from './create.js';
import { downloadSticker } from './download.js';
import { uploadSticker } from './upload.js';
import { normalizeImage } from '../common/image.js';
import { packLinkPrefix } from '../../config/packs.js';

export const addSticker = async (ctx, userFile, pack) => {
  let fileBuffer = await downloadSticker(ctx, userFile.fileId);

  if (userFile.isAnimated === false) {
    try {
      fileBuffer = await normalizeImage(fileBuffer);
    } catch (error) {
      throw new Error(error);
    }
  }

  const stickerFile = await uploadSticker(
    ctx,
    fileBuffer,
    userFile.emoji,
    userFile.isAnimated,
    pack.name,
  );

  await createSticker(pack.id, userFile, stickerFile);

  return {
    title: pack.title,
    link: `${packLinkPrefix}${pack.name}`,
  };
};
