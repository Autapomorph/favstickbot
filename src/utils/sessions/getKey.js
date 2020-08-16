const getSessionKey = ctx => {
  const { chat, callbackQuery, from } = ctx;

  if (!from && chat && chat.type === 'channel') {
    return `ch:${chat.id}`;
  }

  if (chat) {
    return `${chat.id}:${from.id}`;
  }

  if (callbackQuery) {
    return `${callbackQuery.chat_instance}:${from.id}`;
  }

  return `${from.id}:${from.id}`;
};

module.exports = getSessionKey;
