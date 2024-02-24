import { TELEGRAM } from '../types/index.js';

export const DO_NOT_REPLY = [
  TELEGRAM.TOO_MANY_REQUESTS,
  TELEGRAM.USER_NOT_FOUND,
  TELEGRAM.CHAT_NOT_FOUND,
  TELEGRAM.NO_RIGHTS_TO_SEND_MESSAGE,
  TELEGRAM.BLOCKED_BY_USER,
  TELEGRAM.KICKED_FROM_GROUP,
  TELEGRAM.KICKED_FROM_SUPERGROUP,
  TELEGRAM.KICKED_FROM_CHANNEL,
  TELEGRAM.USER_DEACTIVATED,
  TELEGRAM.GROUP_DEACTIVATED,
  TELEGRAM.CANNOT_INITIATE_CONVERSATION_WITH_USER,
  TELEGRAM.NOT_GROUP_MEMBER,
  TELEGRAM.NOT_SUPERGROUP_MEMBER,
  TELEGRAM.NOT_CHANNEL_MEMBER,
];
