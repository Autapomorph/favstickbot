const sharp = require('sharp');

const logger = require('../logger');

const resizeImage = async transformer => {
  const metadata = await transformer.metadata().catch(logger.error);
  const { width: imageWidth, height: imageHeight } = metadata;

  if (imageWidth > 512 || imageHeight > 512 || (imageWidth !== 512 && imageHeight !== 512)) {
    if (imageHeight > imageWidth) {
      transformer.resize({ height: 512 });
    } else {
      transformer.resize({ width: 512 });
    }
  }
};

const getNormalizedImage = async data => {
  const transformer = sharp(data);
  await resizeImage(transformer);
  return transformer.webp({ quality: 100 }).png({ force: false }).toBuffer().catch(logger.error);
};

module.exports = {
  resizeImage,
  getNormalizedImage,
};
