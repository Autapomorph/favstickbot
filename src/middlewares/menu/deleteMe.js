import { MenuMiddleware } from 'telegraf-inline-menu';

import { menu } from '../../controllers/deleteMe/menu.js';

export const deleteMeMenu = new MenuMiddleware('deleteMe/', menu);
