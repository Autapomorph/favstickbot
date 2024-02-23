module.exports = {
  env: {
    es2024: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2024,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'consistent-return': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
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
