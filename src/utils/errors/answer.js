import * as ERROR_TYPES from './types/index.js';

// Base answer error
export const answerError = async (ctx, tKey, resource, showAlert = false, extra = {}) => {
  return ctx.answerCbQuery(ctx.i18n.t(tKey, resource), { ...extra, show_alert: showAlert });
};

// Answer error with telegram error description
export const answerErrorTelegram = async (ctx, error, showAlert = true, extra = {}) => {
  return answerError(ctx, ERROR_TYPES.APP.ANSWER, { error: error.description }, showAlert, extra);
};

// Answer forbidden error
export const answerErrorForbidden = async (ctx, showAlert = false, extra = {}) => {
  return answerError(ctx, ERROR_TYPES.APP.FORBIDDEN.ANSWER, null, showAlert, extra);
};

// Answer unknown error
export const answerErrorUnknown = async (ctx, showAlert = true, extra = {}) => {
  return answerError(ctx, ERROR_TYPES.APP.UNKNOWN, null, showAlert, extra);
};
