// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: [
    'plugin:vue/essential'
  ],
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 8,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': [2, 'never'],
    'no-invalid-regexp': 2,
    'no-unreachable': 2,
    'eqeqeq': [2, 'always'],
    'no-param-reassign': 2,
    'no-useless-call': 2,
    'no-undef': 2,
    'no-unused-vars': [
      1, { 'argsIgnorePattern': '_|err|res|success', 'varsIgnorePattern': 'status' }
    ],
    'no-use-before-define': 2,
    'vue/jsx-uses-vars': 2
  }
}
