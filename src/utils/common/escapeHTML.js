const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

const replaceFn = tag => entityMap[tag] ?? tag;

const escapeHTML = str => String(str).replace(/[&<>'"]/g, replaceFn);

module.exports = escapeHTML;
