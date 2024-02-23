import { sendMessage } from './sendMessage.js';
import { User } from '../../models/User.js';
import { wait } from '../common/wait.js';
import { logger } from '../logger/index.js';

export async function sendToAll(tgInstance, text, authorId) {
  const chats = await User.find();
  try {
    return await sendMessage(text, authorId, chats, tgInstance);
  } catch (error) {
    logger.error(error);
    await wait(1500);
    await tgInstance.sendMessage(authorId, error.message);
  }
}
