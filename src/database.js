const mongoose = require('mongoose');

const logger = require('./utils/logger');

mongoose.set('returnOriginal', false);

mongoose.connection.once('open', () => {
  logger.info('Mongoose connected to database');
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

module.exports = {
  connect,
};
