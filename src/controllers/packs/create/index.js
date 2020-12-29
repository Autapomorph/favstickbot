module.exports = ctx => ctx.scene.enter('PACKS_CREATE');

module.exports.static = ctx => {
  return ctx.scene.enter('PACKS_CREATE', {
    packToCreate: {
      isAnimated: false,
    },
  });
};

module.exports.animated = ctx => {
  return ctx.scene.enter('PACKS_CREATE', {
    packToCreate: {
      isAnimated: true,
    },
  });
};
