const getSessionKey = require('../utils/sessions/getKey');
const getSession = require('../utils/sessions/get');
const saveSession = require('../utils/sessions/save');

module.exports = async (ctx, next) => {
  const key = getSessionKey(ctx);
  ctx.session = await getSession(key);
  await next(ctx);
  await saveSession(key, ctx.session);
};
