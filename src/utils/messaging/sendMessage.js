const wait = require('../common/wait');

const limit = 30;

async function sendResult(authorId, tgInstance, results) {
  let message = `All messages were sent, here are the results:\n\nSuccess: ${results.successCount}`;

  // Errors info
  const errors = Object.keys(results.errors);
  if (errors.length) {
    message += '\n\nErrors:';
    errors.forEach(error => {
      message += `\n${error}: ${results.errors[error]}`;
    });
  }

  return tgInstance.sendMessage(authorId, message);
}

async function sendMessage(
  text,
  authorId,
  chats,
  tgInstance,
  results = { successCount: 0, errors: {} },
) {
  if (chats.length <= 0) {
    await wait(1500);
    return sendResult(authorId, tgInstance, results);
  }

  const resultsCopy = Object.create(results);
  const nextChats = Object.create(chats);
  const currentChats = nextChats.splice(0, limit);

  const requests = currentChats.map(chat =>
    tgInstance.sendMessage(chat.id, text, {
      disable_web_page_preview: 'true',
    }),
  );

  const requestsResults = await Promise.allSettled(requests);
  requestsResults.forEach(({ value, reason }) => {
    if (value) {
      resultsCopy.successCount += 1;
    } else if (reason) {
      if (resultsCopy.errors[reason.description]) {
        resultsCopy.errors[reason.description] += 1;
      } else {
        resultsCopy.errors[reason.description] = 1;
      }
    }
  });

  await wait(1500);
  return sendMessage(text, authorId, nextChats, tgInstance, resultsCopy);
}

module.exports = sendMessage;
