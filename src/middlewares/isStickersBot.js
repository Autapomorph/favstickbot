module.exports = async (ctx, next) => {
  const stickersBotId = 429000;
  const stickersBotUsername = 'Stickers';
  const { id, username, is_bot: isBot } = ctx.message.forward_from;

  if (id === stickersBotId && username === stickersBotUsername && isBot) {
    return next();
  }
};
