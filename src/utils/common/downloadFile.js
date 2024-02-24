import { logger } from '../logger/index.js';

export const downloadFile = async url => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
