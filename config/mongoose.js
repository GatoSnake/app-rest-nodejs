'use strict'

var mongoose = require('mongoose')

module.exports = (app) => {
  logger.info('Initializing mongo ...')

  // Create a new MongoClient
  const DB_URL = `${_config.db.url}`
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    dbName: _config.db.dbName,
    user: _config.db.user,
    pass: _config.db.pass,
    useCreateIndex: true
  })

  const db = mongoose.connection
  global._db = db
  db.on('error', (err) => {
    logger.error(`Error connection: ${err}`)
  })
  db.on('connecting', () => {
    logger.info(`Connecting ...`)
  })
  db.on('connected', () => {
    logger.info(`Connected successfully to mongo server`)
    app.emit('app-ready')
  })
  db.on('disconnected', () => {
    logger.warn(`Disconnected successfully to mongo server`)
  })

  process.on('SIGINT', () => {
    db.close(function () {
      logger.warn('Mongo connection disconnected through app termination')
      process.exit(0)
    })
  })
}
