const getSessionKey = ctx => {
  return ctx.from.id;
};

module.exports = getSessionKey;
