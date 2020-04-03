module.exports = {
  env: {
    browser: true,
    es6: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    THREE: 'readonly',
    AFRAME: 'readonly',
  },
  // parserOptions: {
  //   ecmaVersion: 2018,
  //   sourceType: 'module',
  // },
  rules: {
    'import/prefer-default-export': 'off',
    'no-void': 'off',
    'no-param-reassign': 'off',
    'no-multi-assign': 'off',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-continue': 'off',
  },
};
