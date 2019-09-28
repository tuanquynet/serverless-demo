/* eslint-disable quote-props,key-spacing */
module.exports = {
  'root': true,
  'extends': ['airbnb-base'],
  'rules': {
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'spaced-comment': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'space-in-parens': 'off',
    'space-before-function-paren': 'off',
    'no-spaced-func': 'off',
    'padding-line-between-statements': 'off',
    'no-mixed-operators': 'off',
    'no-else-return': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'prefer-destructuring': 'off',
    'indent': ['error'],
    'yoda': ['error', 'always', {onlyEquality: true}],

    'import/no-anonymous-default-export': 'off',
    'import/prefer-default-export': 'off'
  },
  'globals': {},
  'env': {
    'node': true,
    'browser': true,
    'es6': true,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 8,
    'sourceType': 'module',
    'ecmaFeatures': {
      'impliedStrict': true,
      'jsx': true,
      'classes': true,
    },
  },
  'plugins': [
    'import',
  ],
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js'
      }
    }
  }
};
