const parseIds = userIds => {
  return userIds.reduce((ids, id) => {
    const parsedId = Number.parseInt(id, 10);
    if (!Number.isNaN(parsedId)) ids.push(parsedId);
    return ids;
  }, []);
};

module.exports = {
  parseIds,
};
