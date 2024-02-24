import { MenuMiddleware } from 'telegraf-inline-menu';

import { menu } from '../../controllers/admin/menu/index.js';

export const adminMenu = new MenuMiddleware('admin/', menu);
