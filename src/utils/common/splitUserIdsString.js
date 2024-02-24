export const splitUserIdsString = userIds =>
  userIds ? userIds.split(',').map(Number).filter(Number.isInteger) : [];
