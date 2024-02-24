import { MenuMiddleware } from 'telegraf-inline-menu';

import { menu } from '../../controllers/packs/list/menu/index.js';

export const packsListMenu = new MenuMiddleware('packs/', menu);
