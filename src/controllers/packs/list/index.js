const actions = require('./actions');
const { getPackListKeyboard, replyPackList } = require('./helpers');
const { getSelectedPackId, getVisiblePacks } = require('../../../utils/packs');

const command = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await getVisiblePacks(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListKeyboard = getPackListKeyboard(visiblePacks, selectedPackId);
  return replyPackList(ctx, visiblePacks, packListKeyboard);
};

module.exports = {
  command,
  actions,
};
