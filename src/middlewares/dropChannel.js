import { Composer } from 'telegraf';

export const dropChannel = Composer.chatType('channel', Composer.drop(true));
