const User = require('../models/User');

module.exports = async (ctx, next) => {
  if (ctx.from) {
    ctx.state.user = await User.updateOrCreate(ctx.from);
    return next();
  }
};
