const Telegraf = require('telegraf');
const { compose } = require('telegraf/composer');
const { match } = require('telegraf-i18n');

const {
  setBotInfo,
  session,
  getUser,
  setLocale,
  isStickersBot,
  hasPackLink,
  validateDocument,
  i18n,
  rateLimit,
  logUpdate,
} = require('./middlewares');
const controllers = require('./controllers');
const stage = require('./controllers/stage');
const commandsList = require('./config/commands');
const commands = require('./utils/bot/commands');
const errorBoundary = require('./utils/errors/errorBoundary');

// init bot
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

// register bot commands
commands.register(commandsList);

// register middlewares
bot.use(compose([logUpdate, session, i18n, rateLimit, setBotInfo, getUser, setLocale]));

// handle updates with stage
bot.use(stage);

// handle commands
bot.start(controllers.start);
bot.help(controllers.start);
bot.hears(['/packs', match('cmd.start.btn.packs')], controllers.packs.list);
bot.hears(['/new', match('cmd.start.btn.new')], controllers.packs.create);
bot.command('copy', controllers.packs.copy.reply);
bot.command('restore', controllers.packs.restore.reply);
bot.command('original', controllers.stickers.original);
bot.command('lang', controllers.language);
bot.command('deleteme', controllers.deleteme);

// handle messages with sticker/document/photo subtype
bot.on(['sticker', 'document', 'photo'], validateDocument, controllers.stickers.add);

// handle messages with pack URL
bot.use(Telegraf.url(/addstickers\/(?<packName>.+)/, controllers.packs.copy));

// handle forward messages from @Stickers bot with pack URL to restore packs
bot.on('forward', isStickersBot, hasPackLink, controllers.packs.restore);

// handle callback queries
bot.action(/pack_select:(?<packId>.+)/, controllers.packs.list.actions.select);
bot.action(/pack_hide:(?<packId>.+)/, controllers.packs.list.actions.hide);
bot.action(/pack_restore:(?<packId>.+)/, controllers.packs.list.actions.restore);
bot.action(/language_set:(?<langCode>.+)/, controllers.language.actions.setLanguage);

// handle unknown commands/messages
bot.hears(/\/.+/g, controllers.unknown);
bot.on('message', controllers.start);

// register error handler
bot.catch(errorBoundary);

module.exports = bot;
