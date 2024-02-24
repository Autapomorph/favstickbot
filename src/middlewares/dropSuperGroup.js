import { Composer } from 'telegraf';

export const dropSuperGroup = Composer.chatType('supergroup', Composer.drop(true));
