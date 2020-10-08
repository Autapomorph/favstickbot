const path = require('path');

const defaultEmojis = '🛸';

const placeholderDir = path.resolve(process.cwd(), 'src', 'assets');

module.exports = {
  defaultEmojis,
  placeholderDir,
};
