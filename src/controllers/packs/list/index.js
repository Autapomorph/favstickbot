const actions = require('./actions');
const { getPackListText, getPackListKeyboard, replyPackList } = require('./helpers');
const { getSelectedPackId, getVisiblePacks } = require('../../../utils/packs');

const command = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await getVisiblePacks(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListText = getPackListText(ctx, visiblePacks);
  const packListKeyboard = getPackListKeyboard(visiblePacks, selectedPackId);
  return replyPackList(ctx, packListText, packListKeyboard);
};

module.exports = {
  command,
  actions,
};
