const telegram = require('../telegram');
const {
  packs,
  new: packCreate,
  copy,
  original,
  restore,
  lang,
  cancel,
  help,
} = require('./commands.json');

const getCommands = async () => {
  return telegram.getMyCommands();
};

const registerCommands = async () => {
  return telegram.setMyCommands([packs, packCreate, copy, original, restore, lang, cancel, help]);
};

const unregisterCommands = async () => {
  return telegram.setMyCommands([]);
};

module.exports = {
  getCommands,
  registerCommands,
  unregisterCommands,
};
