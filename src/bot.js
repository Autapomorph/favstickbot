const Telegraf = require('telegraf');
const { compose, drop } = require('telegraf/composer');
const { match } = require('telegraf-i18n');

const {
  setBotInfo,
  session,
  getUser,
  setLocale,
  validateDocument,
  i18n,
  rateLimit,
  menu,
  logUpdate,
} = require('./middlewares');
const controllers = require('./controllers');
const stage = require('./controllers/stage');
const commandsList = require('./config/commands');
const commands = require('./utils/bot/commands');
const errorBoundary = require('./utils/errors/errorBoundary');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

// Register bot commands
commands.register(commandsList);

// Disallow channels
bot.on(['channel_post', 'edited_channel_post'], drop(true));

// Register middlewares
bot.use(compose([logUpdate, session, i18n, rateLimit, setBotInfo, getUser, setLocale]));
bot.use(...menu);
bot.use(stage);

// Handle commands
bot.start(controllers.start);
bot.help(controllers.start);
bot.hears(['/packs', match('keyboard.main.packs')], controllers.packs.list);
bot.hears(['/new', match('keyboard.main.new')], controllers.packs.create);
bot.hears(['/settings', match('keyboard.main.settings')], controllers.settings);
bot.command('copy', controllers.packs.copy.reply);
bot.command('original', controllers.stickers.original);
bot.command('deleteme', controllers.deleteme);

// Handle messages with sticker/document/photo
bot.on(['sticker', 'document', 'photo'], validateDocument, controllers.stickers.add);

// Handle messages with a pack URL
bot.use(Telegraf.url(/addstickers\/(?<packName>.+)/, controllers.packs.copy));

// Handle unknown commands/messages
bot.hears(/\/.+/g, controllers.unknown);
bot.on('message', controllers.start);

// Register error handler
bot.catch(errorBoundary);

module.exports = bot;
