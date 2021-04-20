const { Telegraf, Composer } = require('telegraf');
const { match } = require('@edjopato/telegraf-i18n');

const controllers = require('./controllers');
const stage = require('./controllers/stage');
const mw = require('./middlewares');
const menus = require('./middlewares/menu');
const commandsList = require('./config/commands');
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
bot.use(mw.dropChannel);

// Register middlewares
bot.use(
  Composer.compose([
    mw.logUpdate,
    mw.banGuard,
    mw.devGuard,
    mw.session,
    mw.i18n,
    mw.rateLimit,
    mw.getCommandParts,
    mw.getUser,
    mw.restoreOwner,
    mw.setLocale,
    mw.setAbility,
  ]),
);

// Register scenes
bot.use(stage);

// Register inline menus
userBot.use(Composer.compose([menus.packsList, menus.settings, menus.deleteMe]));
adminBot.use(Composer.compose([menus.admin]));

// User route
userBot.start(controllers.start);
userBot.help(controllers.start);
userBot.hears(['/packs', match('keyboard.main.packs')], controllers.packs.list);
userBot.hears(['/new', match('keyboard.main.new')], controllers.packs.create);
userBot.command('newstatic', controllers.packs.create.static);
userBot.command('newanimated', controllers.packs.create.animated);
userBot.hears(['/settings', match('keyboard.main.settings')], controllers.settings);
userBot.command('copy', controllers.packs.copy.reply);
userBot.command('original', controllers.stickers.original);
userBot.command('deleteme', controllers.deleteMe);
userBot.on(['sticker', 'document', 'photo'], mw.validateDocument, controllers.stickers.add);
userBot.url(/t.me\/addstickers\/(?<packName>.+)/, controllers.packs.copy);
userBot.hears(/^(?<command>\/.+)/g, controllers.unknown);
userBot.on('message', controllers.start);
userBot.on('callback_query', ctx => ctx.answerCbQuery());
userBot.on('my_chat_member', controllers.botStatusChange);

// Admin route
adminBot.hears(['/admin', match('keyboard.main.admin')], controllers.admin.menu);
adminBot.command('ban', controllers.admin.users.ban);
adminBot.command('unban', controllers.admin.users.unban);
adminBot.command(
  'stats',
  Composer.acl(ctx => ctx.state.ability.can('read', 'Stats'), controllers.admin.stats),
);

// Register routes
bot.use(Composer.acl(ctx => ctx.state.ability.can('access', 'AdminMode'), adminBot));
bot.use(userBot);

// Register error handler
bot.catch(errorBoundary);

module.exports = bot;
