import { createHash } from 'node:crypto';

export const createWebhookPath = token => createHash('sha3-256').update(token).digest('hex');
