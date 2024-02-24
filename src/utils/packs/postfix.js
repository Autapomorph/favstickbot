export const trim = (id, botUsername) => String(id).split(`_by_${botUsername}`)[0];

export const pad = (id, botUsername) => `${id}_by_${botUsername}`;
