import mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import { accessibleRecordsPlugin } from '@casl/mongoose';

import { logger } from './utils/logger/index.js';

mongooseLong(mongoose);
mongoose.plugin(accessibleRecordsPlugin);

mongoose.set('returnOriginal', false);

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to database');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from database');
});

mongoose.connection.on('error', error => {
  logger.error(error, { tags: { mongoose: true } });
  process.exit(1);
});

export const connect = async uri => {
  try {
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (error) {
    logger.error(error, { tags: { mongoose: true } });
    process.exit(1);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    logger.error(error, { tags: { mongoose: true } });
    process.exit(1);
  }
};
