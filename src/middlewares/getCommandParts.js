const { on } = require('telegraf').Composer;

const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;

module.exports = on('text', (ctx, next) => {
  const messageText = ctx.updateType === 'channel_post' ? ctx.channelPost.text : ctx.message.text;

  const parts = regex.exec(messageText);
  if (!parts) return next();

  ctx.state.commandParts = {
    text: messageText,
    command: parts[1],
    bot: parts[2],
    args: parts[3],
    get splitArgs() {
      return !parts[3] ? [] : parts[3].split(/\s+/).filter(arg => arg.length);
    },
  };

  return next();
});
