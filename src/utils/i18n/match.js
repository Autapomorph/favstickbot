function match(resourceKey, templateData) {
  return (text, ctx) => {
    if (text && ctx.i18n.t(resourceKey, templateData) === text) {
      return Object.assign([text], {
        index: 0,
        input: text,
      });
    }

    return null;
  };
}

module.exports = match;
