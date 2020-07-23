require('dotenv').config();
const { MongoClient } = require('mongodb');

const logger = require('../logger');

const { MONGODB_URI } = process.env;

module.exports = async (uri = MONGODB_URI) => {
  try {
    return await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
