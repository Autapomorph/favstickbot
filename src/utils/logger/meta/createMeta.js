const createUser = require('./createUser');
const createContexts = require('./createContexts');

const createMeta = ctx => {
  return {
    user: createUser(ctx),
    contexts: createContexts(ctx),
  };
};

module.exports = createMeta;
