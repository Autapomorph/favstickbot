export const botStatusChange = async ctx => {
  const { user } = ctx.state;
  const botId = ctx.botInfo.id;
  const oldChatMember = ctx.myChatMember.old_chat_member;
  const newChatMember = ctx.myChatMember.new_chat_member;

  if (ctx.myChatMember.chat.type !== 'private') {
    return;
  }

  if (newChatMember.user.id !== botId) {
    return;
  }

  if (oldChatMember.status === newChatMember.status) {
    return;
  }

  switch (newChatMember.status) {
    case 'kicked':
    case 'left':
      user.left = true;
      break;

    default:
      user.left = false;
      break;
  }

  await user.save();
};
