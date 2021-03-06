const mongoose = require('mongoose');

const logger = require('./utils/logger');

mongoose.set('returnOriginal', false);

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to database');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from database');
});

mongoose.connection.on('error', error => {
  logger.error(error);
  process.exit(1);
});

const connect = async uri => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    return mongoose.connection;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

module.exports = {
  connect,
  disconnect,
};
