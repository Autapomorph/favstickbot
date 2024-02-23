import { session as telegrafSession } from 'telegraf';

import { getSessionKey } from '../utils/sessions/getKey.js';
import { getSession } from '../utils/sessions/get.js';
import { saveSession } from '../utils/sessions/save.js';
import { deleteSession } from '../utils/sessions/delete.js';

export const session = telegrafSession({
  getSessionKey,
  store: {
    get: getSession,
    set: saveSession,
    delete: deleteSession,
  },
});
