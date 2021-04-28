require('dotenv').config();

const path = require('path');
const { Seeder } = require('mongo-seeding');

const logger = require('../src/utils/logger');

const collectionsPath = path.resolve(__dirname, './data');
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
