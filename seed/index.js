import { fileURLToPath } from 'node:url';

import 'dotenv/config';
import { Seeder } from 'mongo-seeding';

import { logger } from '../src/utils/logger/index.js';

const collectionsPath = fileURLToPath(new URL('./data', import.meta.url));
const seederConfig = {
  database: process.env.MONGODB_URI,
  removeAllDocuments: true,
};

const seeder = new Seeder(seederConfig);
const collections = seeder.readCollectionsFromPath(collectionsPath);

seeder
  .import(collections)
  .then(() => {
    logger.info('Database seed successfull');
  })
  .catch(error => {
    logger.error(error, { sentry: false });
  });
