const Telegraf = require('telegraf');
const { compose, passThru } = require('telegraf/composer');
const { match } = require('telegraf-i18n');

const {
  session,
  updateUser,
  updateLocale,
  isStickersBot,
  hasPackLink,
  i18n,
  rateLimit,
  logger: updateLogger,
} = require('./middlewares');
const { registerCommands } = require('./commands');
const controllers = require('./controllers');
const stage = require('./controllers/stage');
const logger = require('./utils/logger');
const { isProd } = require('./utils');

// init bot
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

// middlewares
bot.use(
  compose([
    !isProd ? updateLogger : passThru(),
    session,
    i18n,
    rateLimit,
    updateUser,
    updateLocale,
    stage,
  ]),
);

// error handling
bot.catch(async (error, ctx) => {
  logger.error(`Bot caught an unhandled error:\n%O\nContext:\n%O`, error, ctx);
  logger.sentry.error(error);

  if (error.description) {
    await ctx.reply(
      ctx.i18n.t('shared.error.reply.telegram', {
        error: error.description,
      }),
    );
  } else {
    await ctx.reply(ctx.i18n.t('shared.error.reply.uncaughtException'));
  }
});

// register bot commands
registerCommands();

// handle /start command
bot.start(controllers.start);
// handle /help command
bot.help(controllers.start);

// handle commands (/command) with i18n support
bot.hears(['/packs', match('cmd.start.btn.packs')], controllers.packs.list.command);
bot.hears(['/new', match('cmd.start.btn.new')], ctx => ctx.scene.enter('PACKS_CREATE'));
bot.command('copy', controllers.packs.copy.enter);
bot.command('restore', controllers.packs.restore.enter);
bot.command('original', ctx => ctx.scene.enter('STICKERS_ORIGINAL'));
bot.command('lang', controllers.language.enter);

// handle messages with pack URL
bot.use(Telegraf.url(/addstickers\/(?<packName>.+)/, controllers.packs.copy.command));

// handle forward messages from @Stickers bot with pack URL to restore packs
bot.on('forward', isStickersBot, hasPackLink, controllers.packs.restore.command);

// handle messages with sticker/document/photo subtype
bot.on(['sticker', 'document', 'photo'], controllers.stickers.add);

// handle callback queries
bot.action(/(pack_select):(.+)/, controllers.packs.list.actions.select);
bot.action(/(pack_hide):(.+)/, controllers.packs.list.actions.hide);
bot.action(/language_set:(.+)/, controllers.language.actions.setLanguage);

module.exports = bot;
