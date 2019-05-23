'use strict'

var mysql = require('mysql')
var util = require('util')

module.exports = () => {
  logger.info('Initializing mysql connection ...')

  const pool = mysql.createPool({
    connectionLimit: _config.db.mysql.connectionLimit,
    host: _config.db.mysql.host,
    user: _config.db.mysql.user,
    password: _config.db.mysql.password,
    database: process.env.NODE_ENV === 'development' ? 'mysql' : _config.db.mysql.database
  })
  pool.getConnection(async (err, connection) => {
    if (err) {
      logger.error(`Error connecting mysql: ${err.stack}`)
      process.exit(0)
    }
    logger.info(`Database connected as id ${connection.threadId}`)
    // promisify for use async/await in queries
    pool.query = util.promisify(pool.query)
    // In development mode I can reset the database
    if (process.env.NODE_ENV === 'development' && _config.db.mysql.resetEveryRestart) {
      try {
        logger.info('Creating database ...')
        const existDb = await pool.query('select schema_name from information_schema.schemata where schema_name = ?', [_config.db.mysql.database])
        logger.info(JSON.stringify(existDb))
      } catch (err) {
        logger.error(err)
        if (err.code === 'ER_DB_CREATE_EXISTS') {
          logger.warn('Removing database ...')
          await pool.query('DROP DATABASE ' + _config.db.mysql.database)
          logger.warn('Database removed')
        }
        process.exit(0)
      }
    } else {
      await pool.query('USE ' + _config.db.mysql.database)
    }

    global._mysql = pool
  })

  process.on('SIGINT', async () => {
    if (process.env.NODE_ENV === 'development' && _config.db.mysql.resetEveryRestart) {
      try {
        logger.warn('Removing database ...')
        await pool.query('DROP DATABASE ' + _config.db.mysql.database)
        logger.warn('Database removed')
      } catch (err) {
        logger.error(err)
        process.exit(0)
      }
    }
    pool.end(() => {
      // all connections in the pool have ended
      logger.warn('Mysql connection disconnected through app termination')
      process.exit(0)
    })
  })
}
