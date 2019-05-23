module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': 'standard',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    'prefer-const': ['error', {destructuring: 'all'}]
  },
  'globals': {
      'rootRequire': 'readonly',
      '_pathbase': 'readonly',
      '_config': 'readonly',
      'logger': 'readonly',
      '_mongodb': 'readonly',
      '_mongoclient': 'readonly',
      '_gridfs': 'readonly',
      '_db': 'readonly'
  }
}
