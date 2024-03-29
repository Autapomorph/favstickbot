import { ForbiddenError, subject } from '@casl/ability';
import { capitalCase } from 'change-case';

import { User } from '../../../../../../models/User.js';
import { rolesEnum } from '../../../../../../config/roles.js';
import { options } from './options.js';

const perPage = options.maxRows;

export const getMenuBody = async ctx => {
  const role = rolesEnum[ctx.match[1]];
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', subject('User', { role }), 'role');
  const roleUserCount = await User.countDocuments({ role });
  return `${capitalCase(role)}: ${roleUserCount}`;
};

export const getMenuChoices = async ctx => {
  const role = rolesEnum[ctx.match[1]];
  const userCount = await User.countDocuments({ role });
  if (userCount <= getSkip(ctx)) {
    setPage(ctx, 1);
  }

  const users = await User.find({ role })
    .skip(getSkip(ctx))
    .limit(perPage)
    .select({ username: 1 })
    .lean();
  return users.reduce((acc, user) => {
    acc[user._id] = user.username || user._id;
    return acc;
  }, {});
};

export async function getTotalPages(ctx) {
  const role = rolesEnum[ctx.match[1]];
  const userCount = await User.countDocuments({ role });
  return Math.ceil(userCount / perPage);
}

export function getCurrentPage(ctx) {
  const role = rolesEnum[ctx.match[1]];
  const roleListPageKey = `${role}sPage`;
  const roleListPage = ctx.session[roleListPageKey];
  if (!Number.parseInt(roleListPage, 10) || roleListPage <= 0) setPage(ctx, 1);
  return ctx.session[roleListPageKey];
}

export function setPage(ctx, page) {
  const role = rolesEnum[ctx.match[1]];
  const roleListPageKey = `${role}sPage`;
  ctx.session[roleListPageKey] = page;
}

function getSkip(ctx) {
  const currentPage = getCurrentPage(ctx);
  const skip = (currentPage - 1) * perPage;
  return skip >= 0 ? skip : 0;
}
