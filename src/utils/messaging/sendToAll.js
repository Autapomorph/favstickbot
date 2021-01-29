const sendMessage = require('./sendMessage');
const User = require('../../models/User');
const wait = require('../common/wait');
const logger = require('../logger');

async function sendToAll(tgInstance, text, authorId) {
  const chats = await User.find();
  try {
    return await sendMessage(text, authorId, chats, tgInstance);
  } catch (error) {
    logger.error(error);
    await wait(1500);
    await tgInstance.sendMessage(authorId, error.message);
  }
}

module.exports = sendToAll;
