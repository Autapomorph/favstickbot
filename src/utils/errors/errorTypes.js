const ERROR_TYPES = {
  REPLY: 'shared.error.reply.telegram',
  ANSWER: 'shared.error.answer.telegram',
  RATELIMIT: 'shared.error.reply.ratelimit',
  UNKNOWN: 'shared.error.reply.unknown',
  PACKS: {
    ACCESS_DENIED: 'actions.pack.reply.error.access_denied',
    TITLE_TOO_LONG: 'scenes.pack_create.reply.error.title_long',
    NAME_TOO_LONG: 'scenes.pack_create.reply.error.name_long',
    NAME_INVALID: 'scenes.pack_create.reply.error.name_invalid',
    NAME_OCCUPIED: 'scenes.pack_create.reply.error.name_occupied',
    COPY: 'actions.pack.reply.error.copy',
    RESTORE: 'actions.pack.reply.error.restore',
  },
  STICKERS: {
    FILE_TYPE: 'stickers.add.reply.error.file_type',
    TOO_MUCH: 'stickers.add.reply.error.stickers_too_much',
    INVALID_EMOJIS: 'stickers.add.reply.error.invalid_emojis',
    NOT_FOUND: 'scenes.original.reply.error.not_found',
  },
  TELEGRAM: {
    // Too Many Requests: retry after *
    TOO_MANY_REQUESTS: /too.*many.*requests/i,
    // Bad Request: user not found
    USER_NOT_FOUND: /user.*not.*found/i,
    // Bad Request: chat not found
    CHAT_NOT_FOUND: /chat.*not.*found/i,
    // Bad Request: message is not modified
    MESSAGE_NOT_MODIFIED: /message.*not.*modified/i,
    // Bad Request: invalid file id
    FILE_ID_INVALID: /invalid.*file.*id/i,
    // Bad Request: STICKERSET_INVALID
    STICKERSET_INVALID: /stickerset.*invalid/i,
    // Bad Request: invalid sticker set name is specified
    STICKERSET_INVALID_NAME: /invalid.*name/i,
    // Bad Request: sticker set name is already occupied
    STICKERSET_NAME_OCCUPIED: /name.*occupied/i,
    // Bad Request: STICKERS_TOO_MUCH
    STICKERS_TOO_MUCH: /stickers.*too.*much/i,
    // Bad Request: invalid sticker emojis
    STICKER_INVALID_EMOJIS: /invalid.*sticker.*emoji/i,
    // Forbidden: bot was blocked by the user
    BLOCKED_BY_USER: /forbidden.*bot.*block.*user/i,
    // Forbidden: user is deactivated
    USER_DEACTIVATED: /forbidden.*user.*deactivated/i,
  },
};

module.exports = ERROR_TYPES;
