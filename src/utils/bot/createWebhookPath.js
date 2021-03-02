const crypto = require('crypto');

module.exports = token => crypto.createHash('sha3-256').update(token).digest('hex');
