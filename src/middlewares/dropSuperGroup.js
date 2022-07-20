const { chatType, drop } = require('telegraf').Composer;

module.exports = chatType('supergroup', drop(true));
