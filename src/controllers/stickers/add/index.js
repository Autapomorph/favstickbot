const { replyErrorFileType, replyErrorAddSticker } = require('./helpers');
const Pack = require('../../../models/Pack');
const { getStickerFile } = require('../../../utils/stickers');
const addSticker = require('../../../utils/stickers/add');
const { getPackByType } = require('../../../utils/packs');
const createPackTg = require('../../../utils/packs/create');
const prepareDefaultPack = require('../../../utils/packs/default');
const logger = require('../../../utils/logger');

module.exports = async ctx => {
  const { user } = ctx.session;

  await ctx.replyWithChatAction('upload_document');

  const inputFile = getStickerFile(ctx);
  if (!inputFile) {
    return replyErrorFileType(ctx);
  }

  const isAnimated = inputFile.is_animated;
  if (user.selectedPack && user.selectedPack.isAnimated !== isAnimated) {
    user.selectedPack = await getPackByType(user.id, isAnimated);
    await user.save();
  }

  if (!user.selectedPack) {
    const defaultPack = prepareDefaultPack(user.id, ctx.me, isAnimated);
    user.selectedPack = await Pack.createNew(defaultPack);
    await user.save();
  }

  if (!user.selectedPack.hasTgInstance) {
    await createPackTg(ctx, user.selectedPack);
    user.selectedPack.hasTgInstance = true;
    await user.selectedPack.save();
  }

  try {
    const { title, link } = await addSticker(ctx, inputFile, user.selectedPack);
    return await ctx.replyWithHTML(
      ctx.i18n.t('stickers.add.reply.ok', {
        title,
        link,
      }),
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  } catch (error) {
    logger.error(error);
    return replyErrorAddSticker(ctx, error);
  }
};
