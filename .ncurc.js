module.exports = {
  target: (name, semver) => {
    if (name === '@grammyjs/i18n') {
      return 'semver';
    }

    return 'latest';
  },
};
