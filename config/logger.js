'use strict'

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize, align } = format

module.exports = () => {
  const myFormat = printf((info) => {
    return `${info.timestamp} [${info.level}]: ${info.message}`
  })

  const logger = createLogger({
    format: combine(
      colorize(),
      timestamp(),
      align(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/app.log' })
    ]
  })

  global.logger = logger
}
