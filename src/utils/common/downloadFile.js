const logger = require('../logger');

const downloadFile = async url => {
  try {
    const response = await fetch(url);
    return await response.buffer();
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

module.exports = downloadFile;
