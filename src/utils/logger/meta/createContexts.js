export const createContexts = ctx => {
  const sceneState = ctx.scene?.state;
  const { state, session, match, update, updateType } = ctx;
  return {
    update: {
      update,
      updateType,
    },
    context: {
      match,
      state,
      session,
      sceneState,
    },
  };
};
