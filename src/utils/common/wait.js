const { promisify } = require('util');

const wait = promisify(setTimeout);

module.exports = wait;
