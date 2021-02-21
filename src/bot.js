const { Telegraf, Composer } = require('telegraf');
const { match } = require('telegraf-i18n');

const {
  devGuard,
  session,
  getUser,
  setLocale,
  validateDocument,
  dropChannel,
  i18n,
  rateLimit,
  menu,
  logUpdate,
} = require('./middlewares');
const controllers = require('./controllers');
const stage = require('./controllers/stage');
const commandsList = require('./config/commands');
const { adminList } = require('./config/userLists');
const commands = require('./utils/bot/commands');
const errorBoundary = require('./utils/errors/errorBoundary');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

const adminBot = new Composer();
const userBot = new Composer();

// Register bot commands
commands.register(bot.telegram)(commandsList);

// Disallow channels
bot.use(dropChannel);

// Register middlewares
bot.use(Composer.compose([logUpdate, devGuard, session, i18n, rateLimit, getUser, setLocale]));
bot.use(...menu);
bot.use(stage);

// Handle commands
userBot.start(controllers.start);
userBot.help(controllers.start);
userBot.hears(['/packs', match('keyboard.main.packs')], controllers.packs.list);
userBot.hears(['/new', match('keyboard.main.new')], controllers.packs.create);
userBot.command('newstatic', controllers.packs.create.static);
userBot.command('newanimated', controllers.packs.create.animated);
userBot.hears(['/settings', match('keyboard.main.settings')], controllers.settings);
userBot.command('copy', controllers.packs.copy.reply);
userBot.command('original', controllers.stickers.original);
userBot.command('deleteme', controllers.deleteme);

// Handle messages with sticker/document/photo
userBot.on(['sticker', 'document', 'photo'], validateDocument, controllers.stickers.add);

// Handle messages with a pack URL
userBot.use(Telegraf.url(/addstickers\/(?<packName>.+)/, controllers.packs.copy));

// Handle unknown commands/messages
userBot.hears(/\/.+/g, controllers.unknown);
userBot.on('message', controllers.start);

bot.use(Composer.acl(adminList, adminBot));
bot.use(userBot);

// Register error handler
bot.catch(errorBoundary);

module.exports = bot;
