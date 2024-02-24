import { MenuMiddleware } from 'telegraf-inline-menu';

import { menu } from '../../controllers/settings/menu.js';

export const settingsMenu = new MenuMiddleware('settings/', menu);
