import { logger } from '../logger/index.js';

export const downloadFile = async url => {
  try {
    const response = await fetch(url);
    return await response.buffer();
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
