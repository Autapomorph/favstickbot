const { customAlphabet } = require('nanoid');

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

const generateID = (length = 30) => {
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};

module.exports = generateID;
