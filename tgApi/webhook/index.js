import { setWebhookCommand } from './set.js';
import { getWebhookCommand } from './get.js';
import { deleteWebhookCommand } from './delete.js';

export const webhookCommand = {
  command: 'webhook',
  aliases: ['wh'],
  description: 'Webhook commands',
  builder: y => {
    y.command(setWebhookCommand);
    y.command(getWebhookCommand);
    y.command(deleteWebhookCommand);
    y.version();
    y.help();
    y.alias('version', 'v');
    y.alias('help', 'h');
    y.demandCommand(1, 'You need at least one command before moving on');
  },
};
