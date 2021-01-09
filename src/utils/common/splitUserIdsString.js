const splitUserIdsString = userIds =>
  userIds ? userIds.split(',').map(Number).filter(Boolean) : [];

module.exports = splitUserIdsString;
