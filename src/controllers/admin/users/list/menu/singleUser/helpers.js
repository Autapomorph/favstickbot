import { ForbiddenError } from '@casl/ability';
import { noCase } from 'change-case';

import { User } from '../../../../../../models/User.js';

export const getMenuBody = async ctx => {
  const userId = ctx.match[2];
  const user = await User.findById(userId);
  const tKey = 'menu.admin.users.user.body';

  ForbiddenError.from(ctx.state.ability).throwUnlessCan('read', 'User', 'role');
  ForbiddenError.from(ctx.state.ability).throwUnlessCan('update', user, 'role');

  const userInfoDisplay = [
    {
      label: ctx.i18n.t(`${tKey}.id`),
      value: user.id,
    },
    {
      label: ctx.i18n.t(`${tKey}.username`),
      value: user.username,
    },
    {
      label: ctx.i18n.t(`${tKey}.full_name`),
      value: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`,
    },
    {
      label: ctx.i18n.t(`${tKey}.role`),
      value: noCase(user.role),
    },
  ];

  return userInfoDisplay.reduce((replyText, info) => {
    return info.value ? `${replyText}\n${info.label}${info.value}` : replyText;
  }, '');
};
