const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

const replaceFn = tag => entityMap[tag] ?? tag;

const escapeHTML = string => String(string).replace(/[&<>'"]/g, replaceFn);

module.exports = escapeHTML;
