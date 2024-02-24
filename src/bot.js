import { Telegraf, Composer } from 'telegraf';
import { message, callbackQuery } from 'telegraf/filters';

import * as controllers from './controllers/index.js';
import { stage } from './controllers/stage.js';
import * as mw from './middlewares/index.js';
import * as menus from './middlewares/menu/index.js';
import * as commandLists from './config/commands.js';
import * as commands from './utils/bot/commands.js';
import { match } from './utils/i18n/match.js';
import { errorBoundary } from './utils/errors/errorBoundary.js';

export const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    webhookReply: false,
  },
});

const adminBot = new Composer();
const userBot = new Composer();

// Register bot commands
Object.values(commandLists).forEach(commandList => {
  commands.register(bot.telegram)({
    commands: commandList.commands,
    scope: commandList.scope,
    language: commandList.language,
  });
});

// Disallow channels
bot.use(mw.dropChannel);

// Disallow supergroups
bot.use(mw.dropSuperGroup);

// Register middlewares
bot.use(
  Composer.compose([
    mw.logUpdate,
    mw.banGuard,
    mw.devGuard,
    mw.session,
    mw.i18n,
    mw.rateLimit,
    mw.throttle,
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
userBot.use(Composer.compose([menus.packsListMenu, menus.settingsMenu, menus.deleteMeMenu]));
adminBot.use(Composer.compose([menus.adminMenu]));

// User route
userBot.start(controllers.start);
userBot.help(controllers.start);
userBot.hears(['/packs', match('keyboard.main.packs')], controllers.packs.list);
userBot.hears(['/new', match('keyboard.main.new')], controllers.packs.create.base);
userBot.command('newstatic', controllers.packs.create.static);
userBot.command('newanimated', controllers.packs.create.animated);
userBot.hears(['/settings', match('keyboard.main.settings')], controllers.settings);
userBot.command('copy', controllers.packs.copy.reply);
userBot.command('original', controllers.stickers.original);
userBot.command('deleteme', controllers.deleteMe);
userBot.on(
  [message('sticker'), message('document'), message('photo')],
  mw.validateDocument,
  controllers.stickers.add,
);
userBot.url(/t.me\/addstickers\/(?<packName>.+)/, controllers.packs.copy.base);
userBot.hears(/^(?<command>\/.+)/g, controllers.unknown);
userBot.on(message(), controllers.start);
userBot.on(callbackQuery(), ctx => ctx.answerCbQuery());
userBot.on('my_chat_member', controllers.botStatusChange);

// Admin route
adminBot.hears(['/admin', match('keyboard.main.admin')], controllers.admin.menu);
adminBot.command('ban', controllers.admin.users.ban);
adminBot.command('unban', controllers.admin.users.unban);
adminBot.command('stats', mw.abilityGuard.can('read', 'Stats')(controllers.admin.stats));

// Register routes
bot.use(Composer.acl(ctx => ctx.state.ability.can('access', 'AdminMode'), adminBot));
bot.use(userBot);

// Register error handler
bot.catch(errorBoundary);
