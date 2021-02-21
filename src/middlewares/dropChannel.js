const { chatType, drop } = require('telegraf').Composer;

module.exports = chatType('channel', drop(true));
