module.exports = ctx => ctx.scene.enter('PACKS/CREATE');

module.exports.static = ctx => {
  return ctx.scene.enter('PACKS/CREATE', {
    packToCreate: {
      isAnimated: false,
    },
  });
};

module.exports.animated = ctx => {
  return ctx.scene.enter('PACKS/CREATE', {
    packToCreate: {
      isAnimated: true,
    },
  });
};
