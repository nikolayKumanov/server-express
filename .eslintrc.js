module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": 0,
    "no-underscore-dangle": "off",
    "no-param-reassign": 0,
    quotes: [2, "double", { avoidEscape: true }],
    "no-return-await": 0,
    "prefer-destructuring": ["error", { object: false, array: false }],
    "no-use-before-define": ["error", { functions: false, classes: false }],
    "no-unused-vars": "off",
  },
};
