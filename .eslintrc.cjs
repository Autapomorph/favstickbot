module.exports = {
  env: {
    es2024: true,
    node: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2024,
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-import-assertions'],
    },
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      node: true,
    },
  },
  rules: {
    'consistent-return': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/extensions': ['error', 'ignorePackages'],
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      files: ['tgApi/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
