const { ESLint } = require('eslint');
const { getFileInfo } = require('prettier');

const removeEslintIgnoredFiles = async files => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map(file => {
      return eslint.isPathIgnored(file);
    }),
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};

const removePrettierIgnoredFiles = async files => {
  const isIgnored = await Promise.all(
    files.map(file => {
      return getFileInfo(file, { ignorePath: '.prettierignore' }).then(
        fileInfo => fileInfo.ignored,
      );
    }),
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};

const addCommand = ([command, match]) => (match.length ? `${command} ${match}` : undefined);
const getCommands = (...commands) => commands.map(addCommand).filter(Boolean);

module.exports = {
  '**/*.{ts,tsx,js,jsx}': async files => {
    const filesToLint = await removeEslintIgnoredFiles(files);
    const filesToPrettify = await removePrettierIgnoredFiles(files);
    return getCommands(
      ['prettier --write', filesToPrettify],
      ['eslint --report-unused-disable-directives --max-warnings=0', filesToLint],
    );
  },
  '**/*.{css,scss,sass,less}': ['prettier --write', 'stylelint --fix'],
  '**/*.json': [`prettier --write`],
  '**/*.md': [`prettier`],
};
