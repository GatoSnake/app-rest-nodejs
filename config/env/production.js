module.exports = {
  session: {
    secret: 'abc123'
  },
  db: {
    url: process.env.DB_URL || 'mongodb://<user>:<password>@<ip>:<port>',
    dbName: process.env.DB_NAME || '<db-name>',
    replicaSet: process.env.DB_REPLICASET || null
  },
  temp: {
    uploads: process.env.TEMP_UPLOADS || './temp/',
    downloads: process.env.TEMP_DOWNLOADS || './temp/'
  }
}
