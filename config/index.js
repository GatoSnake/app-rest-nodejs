'use strict'

const development = require('./env/development')
const production = require('./env/production')
const defaults = {
  root: _pathbase()
}

global._config = {
  development: Object.assign({}, development, defaults),
  test: Object.assign({}, development, defaults),
  production: Object.assign({}, production, defaults)
}[process.env.NODE_ENV || 'development']
