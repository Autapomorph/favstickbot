const sharp = require('sharp');

const logger = require('../logger');

const resizeImage = async transformer => {
  const { width, height } = await transformer.metadata().catch(logger.error);
  if (width > 512 || height > 512 || (width !== 512 && height !== 512)) {
    if (height > width) {
      transformer.resize({ height: 512 });
    } else {
      transformer.resize({ width: 512 });
    }
  }
};

const normalizeImage = async data => {
  const transformer = sharp(data);
  await resizeImage(transformer);
  return transformer.webp({ quality: 100 }).png({ force: false }).toBuffer().catch(logger.error);
};

module.exports = {
  resizeImage,
  normalizeImage,
};
