const createBase = ctx => ctx.scene.enter('PACKS/CREATE');

const createStatic = ctx => {
  return ctx.scene.enter('PACKS/CREATE', {
    packToCreate: {
      isAnimated: false,
    },
  });
};

const createAnimated = ctx => {
  return ctx.scene.enter('PACKS/CREATE', {
    packToCreate: {
      isAnimated: true,
    },
  });
};

export const create = {
  base: createBase,
  static: createStatic,
  animated: createAnimated,
};
