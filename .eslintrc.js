module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    semi: 'off',
    'no-use-before-define': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/semi': 'error',
    eqeqeq: 'off',
    'react/no-children-prop': 'off',
    'space-before-function-paren': 'off'
  }
};
