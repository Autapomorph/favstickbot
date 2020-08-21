const Pack = require('../../../models/Pack');
const actions = require('./actions');
const { getPackListText } = require('./helpers');
const { replyPackList } = require('./replies');
const getPackListKeyboard = require('../../../keyboards/inline/packList');
const getSelectedPackId = require('../../../utils/packs/getSelectedPackId');

module.exports = async ctx => {
  const { user } = ctx.session;
  const visiblePacks = await Pack.findVisible(user.id);
  const selectedPackId = getSelectedPackId(user);
  const packListText = getPackListText(ctx, visiblePacks);
  const packListKeyboard = getPackListKeyboard(visiblePacks, selectedPackId);
  return replyPackList(ctx, packListText, packListKeyboard);
};

module.exports.actions = actions;
