import 'dotenv/config';
import { MongoClient } from 'mongodb';

import { logger } from '../logger/index.js';

const { MONGODB_URI } = process.env;

export const connect = async (uri = MONGODB_URI) => {
  try {
    return await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    logger.error(error, { tags: { migration: true } });
    process.exit(1);
  }
};
