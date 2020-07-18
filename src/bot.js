const Telegraf = require('telegraf');
const { compose } = require('telegraf/composer');
const { match } = require('telegraf-i18n');

const {
  setBotInfo,
  session,
  updateUser,
  updateLocale,
  isStickersBot,
  hasPackLink,
  isDocumentValid,
  i18n,
  rateLimit,
  logUpdate,
} = require('./middlewares');
const controllers = require('./controllers');
const stage = require('./controllers/stage');
const commandsList = require('./config/commands');
const commands = require('./utils/bot/commands');
const errorBoundary = require('./utils/bot/errorBoundary');

// init bot
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

// register bot commands
commands.register(commandsList);

// register middlewares
bot.use(
  compose([logUpdate, setBotInfo, session, i18n, rateLimit, updateUser, updateLocale, stage]),
);

// handle /start & /help commands
bot.start(controllers.start);
bot.help(controllers.start);

// handle commands with i18n support
bot.hears(['/packs', match('cmd.start.btn.packs')], controllers.packs.list.command);
bot.hears(['/new', match('cmd.start.btn.new')], ctx => ctx.scene.enter('PACKS_CREATE'));
bot.command('copy', controllers.packs.copy.enter);
bot.command('restore', controllers.packs.restore.enter);
bot.command('original', ctx => ctx.scene.enter('STICKERS_ORIGINAL'));
bot.command('lang', controllers.language.enter);

// handle messages with sticker/document/photo subtype
bot.on(['sticker', 'document', 'photo'], isDocumentValid, controllers.stickers.add);

// handle messages with pack URL
bot.use(Telegraf.url(/addstickers\/(?<packName>.+)/, controllers.packs.copy.command));

// handle forward messages from @Stickers bot with pack URL to restore packs
bot.on('forward', isStickersBot, hasPackLink, controllers.packs.restore.command);

// handle callback queries
bot.action(/pack_select:(?<packId>.+)/, controllers.packs.list.actions.select);
bot.action(/pack_hide:(?<packId>.+)/, controllers.packs.list.actions.hide);
bot.action(/pack_restore:(?<packId>.+)/, controllers.packs.list.actions.restore);
bot.action(/language_set:(?<langCode>.+)/, controllers.language.actions.setLanguage);

// register error handler
bot.catch(errorBoundary);

module.exports = bot;
