const ERROR_TYPES = require('./errorTypes');

// Base answer error
const answerError = async (ctx, tKey, showAlert = false, extra = {}) => {
  return ctx.answerCbQuery(ctx.i18n.t(tKey), showAlert, extra);
};

// Answer error with resource
const answerErrorWithResource = async (ctx, tKey, resource, showAlert = false, extra = {}) => {
  return ctx.answerCbQuery(ctx.i18n.t(tKey, resource), showAlert, extra);
};

// Answer error with alert
const answerErrorAlert = async (ctx, tKey, extra) => {
  return answerError(ctx, ctx.i18n.t(tKey), true, extra);
};

// Answer error with telegram error description
const answerErrorTelegram = async (ctx, error, showAlert = true, extra) => {
  return answerErrorWithResource(
    ctx,
    ERROR_TYPES.ANSWER,
    { error: error.description },
    showAlert,
    extra,
  );
};

module.exports = {
  answerError,
  answerErrorAlert,
  answerErrorWithResource,
  answerErrorTelegram,
};
