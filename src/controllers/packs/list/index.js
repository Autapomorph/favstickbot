const actions = require('./actions');
const { getPackListText, getPackListKeyboard } = require('./helpers');
const { replyPackList } = require('./replies');
const getSelectedPackId = require('../../../utils/packs/getSelectedPackId');

module.exports = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await getVisiblePacks(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListText = getPackListText(ctx, visiblePacks);
  const packListKeyboard = getPackListKeyboard(visiblePacks, selectedPackId);
  return replyPackList(ctx, packListText, packListKeyboard);
};

module.exports.actions = actions;
