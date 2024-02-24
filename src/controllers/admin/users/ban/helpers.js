export const parseIds = userIds => {
  return userIds.reduce((ids, userId) => {
    const parsedId = Number.parseInt(userId, 10);
    if (!Number.isNaN(parsedId)) ids.push(parsedId);
    return ids;
  }, []);
};
