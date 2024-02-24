const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&quot;',
};

const replaceFn = tag => entityMap[tag] ?? tag;

export const escapeHTML = string => String(string).replace(/[&<>'"]/g, replaceFn);
