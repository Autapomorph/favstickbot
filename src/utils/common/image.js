const sharp = require('sharp');

const resizeImage = (transformer, { width, height }) => {
  if (width > 512 || height > 512 || (width !== 512 && height !== 512)) {
    if (width > height) return transformer.resize({ width: 512 });
    return transformer.resize({ height: 512 });
  }
};

const normalizeImage = async data => {
  const transformer = sharp(data);
  const metadata = await transformer.metadata();
  resizeImage(transformer, metadata);
  return transformer.webp({ quality: 100 }).png({ force: false }).toBuffer();
};

module.exports = {
  resizeImage,
  normalizeImage,
};
