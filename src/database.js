const mongoose = require('mongoose');

const logger = require('./utils/logger');

const connect = uri => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  mongoose.connection.on('error', error => {
    logger.error(error, { description: 'Error during connection to the database:' });
    process.exit(1);
  });
};

const addConnectListener = onSuccess => {
  mongoose.connection.once('open', async () => {
    logger.info('Connected to database');
    return onSuccess();
  });
};

module.exports = {
  connect,
  addConnectListener,
};
